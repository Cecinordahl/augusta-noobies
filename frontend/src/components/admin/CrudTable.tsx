export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  render?: (value: T) => string;
}

interface CrudTableProps<T extends { id: string }> {
  columns: ColumnConfig<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete: (row: T) => void;
}

export function CrudTable<T extends { id: string }>({
  columns,
  rows,
  onEdit,
  onDelete,
}: CrudTableProps<T>) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
          {columns.map((col) => (
            <th key={String(col.key)} className="py-2 pr-4">
              {col.label}
            </th>
          ))}
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-b border-gray-100">
            {columns.map((col) => (
              <td key={String(col.key)} className="py-2 pr-4">
                {col.render ? col.render(row) : String(row[col.key] ?? "")}
              </td>
            ))}
            <td className="py-2 text-right">
              {onEdit && (
                <button onClick={() => onEdit(row)} className="mr-3 text-green-deep hover:underline">
                  Rediger
                </button>
              )}
              <button onClick={() => onDelete(row)} className="text-red-600 hover:underline">
                Slett
              </button>
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length + 1} className="py-6 text-gray-500">
              Ingen rader ennå.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
