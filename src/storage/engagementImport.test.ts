import { describe, expect, it } from "vitest";
import { sampleEngagement } from "../data/sampleEngagement";
import { parseEngagementJson } from "./engagementImport";

describe("engagement import", () => {
  it("normalizes valid engagement JSON", () => {
    const imported = parseEngagementJson(JSON.stringify(sampleEngagement));

    expect(imported.name).toBe(sampleEngagement.name);
    expect(imported.targets.length).toBe(sampleEngagement.targets.length);
    expect(imported.updatedAt).toBeTruthy();
  });

  it("rejects incomplete engagement JSON", () => {
    expect(() => parseEngagementJson(JSON.stringify({ name: "No client" }))).toThrow(
      "requires name, client, and codename"
    );
  });
});
