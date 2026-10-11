import { EntityAdminPage } from "../../../components/admin/EntityAdminPage";
import type { Highlight } from "../../../types";

export function HighlightsAdmin() {
  return (
    <EntityAdminPage<Highlight>
      title="Historier og sitater"
      endpoint="/api/highlights"
      columns={[
        { key: "tournamentId", label: "Turnering (år)" },
        { key: "text", label: "Tekst" },
        { key: "author", label: "Forfatter" },
      ]}
      fields={[
        { key: "tournamentId", label: "Turnering-ID (år)", type: "text", required: true },
        { key: "text", label: "Tekst", type: "textarea", required: true },
        { key: "author", label: "Forfatter", type: "text" },
      ]}
      emptyValue={{ tournamentId: "", text: "", author: "" }}
    />
  );
}
