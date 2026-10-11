import { EntityAdminPage } from "../../../components/admin/EntityAdminPage";
import type { Result } from "../../../types";

export function ResultsAdmin() {
  return (
    <EntityAdminPage<Result>
      title="Resultater"
      endpoint="/api/results"
      columns={[
        { key: "tournamentId", label: "Turnering (år)" },
        { key: "playerId", label: "Spiller-ID" },
        { key: "score", label: "Score" },
        { key: "hcpPercentage", label: "HCP%" },
        { key: "placement", label: "Plassering" },
      ]}
      fields={[
        { key: "tournamentId", label: "Turnering-ID (år)", type: "text", required: true },
        { key: "playerId", label: "Spiller-ID", type: "text", required: true },
        { key: "score", label: "Score", type: "number", required: true },
        { key: "hcpPercentage", label: "HCP%", type: "number", required: true },
        { key: "placement", label: "Plassering", type: "number", required: true },
      ]}
      emptyValue={{ tournamentId: "", playerId: "", score: 0, hcpPercentage: 100, placement: 1 }}
    />
  );
}
