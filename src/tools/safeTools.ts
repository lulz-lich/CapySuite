export interface ScopeRecord {
  input: string;
  host: string;
  scheme: string;
  path: string;
  queryKeys: string[];
  flags: string[];
}

export interface SecretSignal {
  label: string;
  redacted: string;
  entropy: number;
  confidence: "Low" | "Medium" | "High";
  reason: string;
}

export interface HeaderFinding {
  header: string;
  present: boolean;
  note: string;
}

export interface IndicatorSet {
  urls: string[];
  domains: string[];
  ipv4: string[];
  hashes: string[];
  emails: string[];
}

export interface SanitizedText {
  output: string;
  redactions: Array<{ type: string; count: number }>;
}

const secretPatterns = [
  {
    label: "AWS access key style value",
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
    reason: "Matches a common cloud access-key format."
  },
  {
    label: "Private key header",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/g,
    reason: "Contains a private-key block marker."
  },
  {
    label: "Token-like assignment",
    pattern: /\b(?:api[_-]?key|token|secret|password)\b\s*[:=]\s*["']?([A-Za-z0-9_\-./+=]{16,})/gi,
    reason: "Looks like a named secret assignment."
  },
  {
    label: "High-entropy blob",
    pattern: /\b[A-Za-z0-9_\-+/=]{32,}\b/g,
    reason: "Long encoded-looking value with elevated entropy."
  }
];

export function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function shannonEntropy(value: string) {
  if (!value) return 0;
  const counts = new Map<string, number>();
  for (const char of value) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }
  return Array.from(counts.values()).reduce((entropy, count) => {
    const probability = count / value.length;
    return entropy - probability * Math.log2(probability);
  }, 0);
}

export function redact(value: string) {
  if (value.length <= 8) return "*".repeat(value.length);
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function normalizeHost(host: string) {
  return host.replace(/^www\./, "").toLowerCase();
}

function isIpLike(host: string) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}

export function analyzeScopeInput(input: string): ScopeRecord[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const candidate = line.includes("://") ? line : `https://${line}`;
      const flags: string[] = [];

      try {
        const parsed = new URL(candidate);
        const host = normalizeHost(parsed.hostname);
        if (parsed.protocol === "http:") flags.push("plain-http");
        if (isIpLike(host)) flags.push("ip-address");
        if (parsed.searchParams.size > 0) flags.push("query-parameters");
        if (/prod|production/i.test(line)) flags.push("production-name");
        if (/admin|manage|console/i.test(line)) flags.push("admin-surface");

        return {
          input: line,
          host,
          scheme: parsed.protocol.replace(":", ""),
          path: parsed.pathname || "/",
          queryKeys: Array.from(parsed.searchParams.keys()),
          flags: flags.length ? flags : ["reviewed"]
        };
      } catch {
        return {
          input: line,
          host: "unparsed",
          scheme: "unknown",
          path: "/",
          queryKeys: [],
          flags: ["parse-error"]
        };
      }
    });
}

export function analyzeSecrets(input: string): SecretSignal[] {
  const signals: SecretSignal[] = [];

  for (const { label, pattern, reason } of secretPatterns) {
    const matches = input.matchAll(pattern);
    for (const match of matches) {
      const raw = match[1] ?? match[0];
      const entropy = Number(shannonEntropy(raw).toFixed(2));
      if (label === "High-entropy blob" && entropy < 4) continue;
      signals.push({
        label,
        redacted: redact(raw),
        entropy,
        confidence:
          label === "Private key header" || label.includes("AWS")
            ? "High"
            : entropy >= 4
              ? "Medium"
              : "Low",
        reason
      });
    }
  }

  return signals;
}

export function analyzeHeaders(input: string): HeaderFinding[] {
  const lowerHeaders = new Set(
    input
      .split(/\r?\n/)
      .map((line) => line.split(":")[0]?.trim().toLowerCase())
      .filter(Boolean)
  );

  const required = [
    ["strict-transport-security", "Encourages HTTPS-only browser behavior."],
    ["content-security-policy", "Constrains browser execution and content sources."],
    ["x-content-type-options", "Reduces MIME-sniffing risk."],
    ["referrer-policy", "Limits sensitive URL leakage through referrers."],
    ["permissions-policy", "Restricts powerful browser features."],
    ["x-frame-options", "Provides legacy clickjacking protection."]
  ] as const;

  return required.map(([header, note]) => ({
    header,
    present: lowerHeaders.has(header),
    note
  }));
}

export function extractIndicators(input: string): IndicatorSet {
  const urls = uniqueSorted(input.match(/\bhttps?:\/\/[^\s"'<>]+/gi) ?? []);
  const ipv4 = uniqueSorted(input.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? []);
  const hashes = uniqueSorted(
    input.match(/\b[a-f0-9]{32}\b|\b[a-f0-9]{40}\b|\b[a-f0-9]{64}\b/gi) ?? []
  );
  const emails = uniqueSorted(input.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? []);
  const urlHosts = urls
    .map((url) => {
      try {
        return normalizeHost(new URL(url).hostname);
      } catch {
        return "";
      }
    })
    .filter(Boolean);
  const domains = uniqueSorted([
    ...urlHosts,
    ...(input.match(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi) ?? []).map(normalizeHost)
  ]).filter((domain) => !emails.some((email) => email.toLowerCase().includes(domain)));

  return { urls, domains, ipv4, hashes, emails };
}

export function buildFindingDraft(
  title: string,
  impact: string,
  evidence: string,
  recommendation: string
) {
  return [
    `### ${title || "Finding title"}`,
    "",
    "**Impact**",
    impact || "Describe business and technical impact in authorized-scope terms.",
    "",
    "**Evidence Metadata**",
    evidence ||
      "Reference sanitized evidence metadata, timestamps, routes, request IDs, or ticket IDs.",
    "",
    "**Recommendation**",
    recommendation || "Provide a practical remediation path and verification guidance.",
    "",
    "**Safety Note**",
    "This finding draft intentionally avoids secrets, payloads, credential material, and exploit instructions."
  ].join("\n");
}

function applyRedaction(input: string, type: string, pattern: RegExp, replacement: string) {
  const matches = input.match(pattern);
  return {
    output: input.replace(pattern, replacement),
    redaction: matches?.length ? { type, count: matches.length } : null
  };
}

export function sanitizeEvidenceText(input: string): SanitizedText {
  const redactions: SanitizedText["redactions"] = [];
  let output = input;

  const rules: Array<[string, RegExp, string]> = [
    ["bearer-token", /\bBearer\s+[A-Za-z0-9._~+/=-]{12,}/gi, "Bearer [REDACTED_TOKEN]"],
    [
      "secret-assignment",
      /\b(api[_-]?key|token|secret|password)\b\s*[:=]\s*["']?[A-Za-z0-9_\-./+=]{12,}["']?/gi,
      "$1=[REDACTED_SECRET]"
    ],
    ["aws-key-style", /\bAKIA[0-9A-Z]{16}\b/g, "[REDACTED_AWS_KEY]"],
    [
      "private-key-header",
      /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/g,
      "[REDACTED_PRIVATE_KEY_HEADER]"
    ],
    ["email", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]"]
  ];

  for (const [type, pattern, replacement] of rules) {
    const result = applyRedaction(output, type, pattern, replacement);
    output = result.output;
    if (result.redaction) {
      redactions.push(result.redaction);
    }
  }

  return { output, redactions };
}
