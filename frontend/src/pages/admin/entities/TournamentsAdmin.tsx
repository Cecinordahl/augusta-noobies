import { EntityAdminPage } from "../../../components/admin/EntityAdminPage";
import type { Tournament } from "../../../types";

export function TournamentsAdmin() {
  return (
    <EntityAdminPage<Tournament>
      title="Turneringer"
      endpoint="/api/tournaments"
      columns={[
        { key: "year", label: "År" },
        { key: "location", label: "Sted" },
        { key: "date", label: "Dato" },
        { key: "hcpPercentage", label: "HCP%" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { key: "year", label: "År", type: "number", required: true },
        { key: "date", label: "Dato (YYYY-MM-DD)", type: "text", required: true },
        { key: "location", label: "Sted", type: "text", required: true },
        { key: "courseId", label: "Bane-ID", type: "text" },
        { key: "hcpPercentage", label: "HCP%", type: "number", required: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          required: true,
          options: [
            { value: "planned", label: "Planlagt" },
            { value: "completed", label: "Fullført" },
            { value: "cancelled", label: "Avlyst" },
          ],
        },
        { key: "registeredPlayerIdsCsv", label: "Påmeldte spiller-ID-er (kommaseparert)", type: "text" },
      ]}
      emptyValue={{
        year: new Date().getFullYear(),
        date: "",
        location: "",
        courseId: "",
        hcpPercentage: 100,
        status: "planned",
        registeredPlayerIdsCsv: "",
      }}
      toFormValues={(row) => ({
        ...row,
        registeredPlayerIdsCsv: row.registeredPlayerIds.join(", "),
      })}
      fromFormValues={(values) => {
        const csv = String(values.registeredPlayerIdsCsv ?? "");
        const registeredPlayerIds = csv
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        return {
          year: values.year,
          date: values.date,
          location: values.location,
          courseId: values.courseId,
          hcpPercentage: values.hcpPercentage,
          status: values.status,
          id: String(values.year),
          registeredPlayerIds,
        };
      }}
    />
  );
}
