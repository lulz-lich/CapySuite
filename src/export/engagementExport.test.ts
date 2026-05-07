import { describe, expect, it } from "vitest";
import { sampleEngagement } from "../data/sampleEngagement";
import {
  engagementToJson,
  engagementToMarkdown,
  engagementToMitreNavigatorLayer
} from "./engagementExport";

describe("engagement export", () => {
  it("exports professional markdown sections", () => {
    const markdown = engagementToMarkdown(sampleEngagement);

    expect(markdown).toContain("# Authorized Web Platform Assessment");
    expect(markdown).toContain("## Safety Boundary");
    expect(markdown).toContain("## Attack Chain Timeline");
    expect(markdown).toContain("MITRE ATT&CK");
  });

  it("exports valid JSON", () => {
    const parsed = JSON.parse(engagementToJson(sampleEngagement));

    expect(parsed.codename).toBe("GREEN HARBOR");
    expect(parsed.targets.length).toBeGreaterThan(0);
  });

  it("exports a MITRE Navigator layer", () => {
    const layer = JSON.parse(engagementToMitreNavigatorLayer(sampleEngagement));

    expect(layer.domain).toBe("enterprise-attack");
    expect(
      layer.techniques.some(
        (technique: { techniqueID: string }) => technique.techniqueID === "T1595"
      )
    ).toBe(true);
  });
});
