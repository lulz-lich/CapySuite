import { describe, expect, it } from "vitest";
import { sampleEngagement } from "../data/sampleEngagement";
import {
  getMitreCoverage,
  getReadinessChecks,
  getReadinessScore,
  getSeverityCounts
} from "./analytics";

describe("engagement analytics", () => {
  it("computes readiness checks and score", () => {
    const checks = getReadinessChecks(sampleEngagement);
    const score = getReadinessScore(sampleEngagement);

    expect(checks.length).toBeGreaterThan(5);
    expect(score).toBeGreaterThan(70);
  });

  it("computes severity and MITRE coverage", () => {
    const counts = getSeverityCounts(sampleEngagement);
    const coverage = getMitreCoverage(sampleEngagement);

    expect(counts.Medium).toBe(1);
    expect(coverage.uniqueIds).toContain("T1595");
    expect(coverage.mappedFindings).toBe(2);
  });
});
