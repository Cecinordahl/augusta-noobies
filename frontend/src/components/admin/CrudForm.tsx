import { type FormEvent, useState } from "react";
import { apiUpload } from "../../lib/api";

export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "checkbox" | "image";
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  /** For type "image": Cloudinary folder to upload into, e.g. "players". Defaults to "misc". */
  uploadFolder?: string;
}

interface CrudFormProps {
  fields: FieldConfig[];
  initialValue: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  onCancel: () => void;
  submitLabel: string;
}

export function CrudForm({ fields, initialValue, onSubmit, onCancel, submitLabel }: CrudFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValue);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageSelect(field: FieldConfig, file: File | undefined) {
    if (!file) return;
    setUploadingKey(field.key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (field.uploadFolder) formData.append("folder", field.uploadFolder);
      const result = await apiUpload<{ url: string }>("/api/uploads", formData);
      setField(field.key, result.url);
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded border border-gray-200 bg-white p-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-near-black">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              required={field.required}
              value={(values[field.key] as string) ?? ""}
              onChange={(e) => setField(field.key, e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              rows={4}
            />
          ) : field.type === "select" ? (
            <select
              required={field.required}
              value={(values[field.key] as string) ?? ""}
              onChange={(e) => setField(field.key, e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            >
              <option value="" disabled>
                Velg…
              </option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={Boolean(values[field.key])}
              onChange={(e) => setField(field.key, e.target.checked)}
              className="mt-1"
            />
          ) : field.type === "image" ? (
            <div className="mt-1 space-y-2">
              {typeof values[field.key] === "string" && values[field.key] ? (
                <img src={values[field.key] as string} alt="" className="h-20 w-20 rounded object-cover" />
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(field, e.target.files?.[0])}
                className="block w-full text-sm"
              />
              {uploadingKey === field.key && <p className="text-sm text-gray-500">Laster opp…</p>}
            </div>
          ) : (
            <input
              type={field.type}
              required={field.required}
              value={(values[field.key] as string | number) ?? ""}
              onChange={(e) =>
                setField(field.key, field.type === "number" ? Number(e.target.value) : e.target.value)
              }
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          )}
        </div>
      ))}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploadingKey !== null}
          className="rounded bg-green-deep px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50"
        >
          {saving ? "Lagrer…" : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="rounded border border-gray-300 px-4 py-2 text-sm">
          Avbryt
        </button>
      </div>
    </form>
  );
}
