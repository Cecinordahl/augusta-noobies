import { EntityAdminPage } from "../../../components/admin/EntityAdminPage";
import type { Course } from "../../../types";

export function CoursesAdmin() {
  return (
    <EntityAdminPage<Course>
      title="Baner"
      endpoint="/api/courses"
      columns={[{ key: "name", label: "Navn" }]}
      fields={[
        { key: "name", label: "Navn", type: "text", required: true },
        { key: "localRules", label: "Lokale regler", type: "textarea" },
      ]}
      emptyValue={{ name: "", localRules: "" }}
    />
  );
}
