import { EntityAdminPage } from "../../../components/admin/EntityAdminPage";
import type { Player } from "../../../types";

export function PlayersAdmin() {
  return (
    <EntityAdminPage<Player>
      title="Spillere"
      endpoint="/api/players"
      columns={[
        { key: "name", label: "Navn" },
        { key: "joinedYear", label: "Med siden" },
        { key: "photoUrl", label: "Bilde" },
      ]}
      fields={[
        { key: "name", label: "Navn", type: "text", required: true },
        { key: "joinedYear", label: "Med siden (år)", type: "number", required: true },
        { key: "photoUrl", label: "Bilde", type: "image", uploadFolder: "players" },
      ]}
      emptyValue={{ name: "", joinedYear: new Date().getFullYear(), photoUrl: "" }}
    />
  );
}
