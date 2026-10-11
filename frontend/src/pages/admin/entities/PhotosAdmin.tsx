import { type FormEvent, useEffect, useState } from "react";
import { apiDelete, apiGet, apiUpload } from "../../../lib/api";
import { CrudTable } from "../../../components/admin/CrudTable";
import type { Photo } from "../../../types";

export function PhotosAdmin() {
  const [rows, setRows] = useState<Photo[]>([]);
  const [tournamentId, setTournamentId] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function reload() {
    apiGet<Photo[]>("/api/photos").then(setRows);
  }

  useEffect(reload, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || !tournamentId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("tournamentId", tournamentId);
      formData.append("caption", caption);
      formData.append("file", file);
      await apiUpload("/api/photos", formData);
      setTournamentId("");
      setCaption("");
      setFile(null);
      setShowForm(false);
      reload();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photo: Photo) {
    if (!window.confirm("Slette dette bildet?")) return;
    await apiDelete(`/api/photos/${photo.id}`);
    reload();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bilder</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-green-deep px-4 py-2 text-sm font-semibold text-cream"
          >
            Last opp
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 max-w-lg space-y-4 rounded border border-gray-200 bg-white p-4">
          <div>
            <label className="block text-sm font-medium text-near-black">Turnering-ID (år)</label>
            <input
              required
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-near-black">Bildetekst</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-near-black">Fil</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="rounded bg-green-deep px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50"
            >
              {uploading ? "Laster opp…" : "Last opp"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded border border-gray-300 px-4 py-2 text-sm"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}

      <CrudTable
        columns={[
          { key: "tournamentId", label: "Turnering (år)" },
          { key: "caption", label: "Bildetekst" },
          { key: "url", label: "URL" },
        ]}
        rows={rows}
        onDelete={handleDelete}
      />
    </div>
  );
}
