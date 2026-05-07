import { Copy, Download, FileJson, FileText, Network } from "lucide-react";
import {
  engagementToJson,
  engagementToMarkdown,
  engagementToMitreNavigatorLayer,
  downloadText
} from "../export/engagementExport";
import type { Engagement } from "../models/engagement";

export function ExportPanel({ engagement }: { engagement: Engagement }) {
  const markdown = engagementToMarkdown(engagement);
  const json = engagementToJson(engagement);
  const navigatorLayer = engagementToMitreNavigatorLayer(engagement);
  const slug =
    engagement.codename
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "engagement";

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
  };

  return (
    <section className="panel export-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Export</p>
          <h2>Engagement summary</h2>
        </div>
        <FileText size={18} aria-hidden="true" />
      </div>

      <div className="export-actions">
        <button
          className="action-button"
          type="button"
          onClick={() => downloadText(`${slug}-summary.md`, markdown, "text/markdown")}
        >
          <Download size={16} />
          Markdown
        </button>
        <button
          className="action-button"
          type="button"
          onClick={() => downloadText(`${slug}-engagement.json`, json, "application/json")}
        >
          <FileJson size={16} />
          JSON
        </button>
        <button
          className="action-button"
          type="button"
          onClick={() =>
            downloadText(`${slug}-mitre-navigator-layer.json`, navigatorLayer, "application/json")
          }
        >
          <Network size={16} />
          ATT&CK Layer
        </button>
        <button className="icon-text-button" type="button" onClick={copyMarkdown}>
          <Copy size={15} />
          Copy MD
        </button>
      </div>

      <textarea
        className="export-preview"
        value={markdown}
        readOnly
        rows={14}
        aria-label="Markdown export preview"
      />
    </section>
  );
}
