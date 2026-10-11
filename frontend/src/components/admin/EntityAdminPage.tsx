import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../../lib/api";
import { CrudTable, type ColumnConfig } from "./CrudTable";
import { CrudForm, type FieldConfig } from "./CrudForm";

interface EntityAdminPageProps<T extends { id: string }> {
  title: string;
  endpoint: string;
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  emptyValue: Record<string, unknown>;
  /** Convert a row (T) into the flat values object the form fields expect. Defaults to identity. */
  toFormValues?: (row: T) => Record<string, unknown>;
  /** Convert submitted form values back into the API body shape. Defaults to identity. */
  fromFormValues?: (values: Record<string, unknown>) => Record<string, unknown>;
}

export function EntityAdminPage<T extends { id: string }>({
  title,
  endpoint,
  columns,
  fields,
  emptyValue,
  toFormValues = (row) => row as unknown as Record<string, unknown>,
  fromFormValues = (values) => values,
}: EntityAdminPageProps<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [editing, setEditing] = useState<T | "new" | null>(null);

  function reload() {
    apiGet<T[]>(endpoint).then(setRows);
  }

  useEffect(reload, [endpoint]);

  async function handleSubmit(values: Record<string, unknown>) {
    const body = fromFormValues(values);
    if (editing === "new") {
      await apiPost(endpoint, body);
    } else if (editing) {
      await apiPut(`${endpoint}/${editing.id}`, body);
    }
    setEditing(null);
    reload();
  }

  async function handleDelete(row: T) {
    if (!window.confirm("Slette denne raden?")) return;
    await apiDelete(`${endpoint}/${row.id}`);
    reload();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        {editing === null && (
          <button
            onClick={() => setEditing("new")}
            className="rounded bg-green-deep px-4 py-2 text-sm font-semibold text-cream"
          >
            Legg til
          </button>
        )}
      </div>

      {editing !== null && (
        <div className="mb-6">
          <CrudForm
            fields={fields}
            initialValue={editing === "new" ? emptyValue : toFormValues(editing)}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitLabel={editing === "new" ? "Opprett" : "Lagre"}
          />
        </div>
      )}

      <CrudTable columns={columns} rows={rows} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
