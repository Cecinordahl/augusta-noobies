import { EntityAdminPage } from "../../../components/admin/EntityAdminPage";
import type { SidePrize } from "../../../types";

export function SidePrizesAdmin() {
  return (
    <EntityAdminPage<SidePrize>
      title="Sidepriser"
      endpoint="/api/side-prizes"
      columns={[
        { key: "tournamentId", label: "Turnering (år)" },
        { key: "title", label: "Tittel" },
        { key: "winnerPlayerId", label: "Vinner-ID" },
      ]}
      fields={[
        { key: "tournamentId", label: "Turnering-ID (år)", type: "text", required: true },
        { key: "title", label: "Tittel", type: "text", required: true },
        { key: "winnerPlayerId", label: "Vinner spiller-ID", type: "text" },
        { key: "description", label: "Beskrivelse", type: "textarea" },
      ]}
      emptyValue={{ tournamentId: "", title: "", winnerPlayerId: "", description: "" }}
    />
  );
}
