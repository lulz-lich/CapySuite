import { describe, expect, it } from "vitest";
import {
  analyzeHeaders,
  analyzeScopeInput,
  analyzeSecrets,
  buildFindingDraft,
  extractIndicators,
  sanitizeEvidenceText
} from "./safeTools";

describe("safe tool workbench", () => {
  it("normalizes scope input without network calls", () => {
    const records = analyzeScopeInput("http://admin.example.test/users?id=1\napi.example.test/v1");

    expect(records[0].flags).toContain("plain-http");
    expect(records[0].flags).toContain("admin-surface");
    expect(records[1].host).toBe("api.example.test");
  });

  it("redacts token-like values", () => {
    const signals = analyzeSecrets('API_KEY="sample_token_value_1234567890"');

    expect(signals.length).toBeGreaterThan(0);
    expect(signals[0].redacted).not.toContain("token_value");
  });

  it("checks defensive headers", () => {
    const findings = analyzeHeaders(
      "Content-Security-Policy: default-src 'self'\nReferrer-Policy: no-referrer"
    );

    expect(findings.find((item) => item.header === "content-security-policy")?.present).toBe(true);
    expect(findings.find((item) => item.header === "strict-transport-security")?.present).toBe(
      false
    );
  });

  it("extracts indicators from text", () => {
    const indicators = extractIndicators(
      "Saw https://portal.example.test and 10.0.0.5 with d41d8cd98f00b204e9800998ecf8427e"
    );

    expect(indicators.urls).toContain("https://portal.example.test");
    expect(indicators.ipv4).toContain("10.0.0.5");
    expect(indicators.hashes.length).toBe(1);
  });

  it("builds a safe finding draft", () => {
    const draft = buildFindingDraft("Missing header", "", "", "");

    expect(draft).toContain("Safety Note");
    expect(draft).toContain("Missing header");
  });

  it("sanitizes sensitive evidence text", () => {
    const sanitized = sanitizeEvidenceText(
      'Authorization: Bearer abcdefghijklmnopqrstuvwxyz\nadmin@example.test API_KEY="sampletoken123456"'
    );

    expect(sanitized.output).toContain("[REDACTED_TOKEN]");
    expect(sanitized.output).toContain("[REDACTED_EMAIL]");
    expect(sanitized.output).not.toContain("sampletoken123456");
  });
});
