import React, { useEffect, useMemo, useState } from "react";
import { FiGrid, FiPlus, FiEdit2, FiTrash2, FiSave } from "react-icons/fi";
import CardShell from "../components/CardShell";
import Modal from "../components/Modal";
import ModeSelector from "../components/ModeSelector";
import { ensureIds, saveCatalog, slugify } from "../utils";

const CategoriesPage = ({ catalog, setCatalog }) => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    homeIconUrl: "",
    homeBadge: "",
    hasSaleBadge: false,
    showOnHome: true,
  });

  const categories = catalog.categories || [];
  const editing = useMemo(() => categories.find((c) => c.id === editingId) || null, [categories, editingId]);

  useEffect(() => {
    if (!editing) {
      setForm({
        title: "",
        slug: "",
        homeIconUrl: "",
        homeBadge: "",
        hasSaleBadge: false,
        showOnHome: true,
      });
      return;
    }
    const safe = ensureIds({ ...catalog, categories: [editing] }).categories[0];
    setForm({
      title: safe.title || "",
      slug: safe.slug || "",
      homeIconUrl: safe.homeIconUrl || "",
      homeBadge: safe.homeBadge || "",
      hasSaleBadge: Boolean(safe.hasSaleBadge),
      showOnHome: safe.showOnHome !== false,
    });
  }, [editing]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const reset = () => {
    setEditingId(null);
    setForm({
      title: "",
      slug: "",
      homeIconUrl: "",
      homeBadge: "",
      hasSaleBadge: false,
      showOnHome: true,
    });
    setIsModalOpen(false);
  };

  const upsert = () => {
    const title = form.title.trim();
    if (!title) return alert("Category title required");

    const slug = slugify(title).trim();
    const homeIconUrl = form.homeIconUrl.trim();
    const homeBadge = form.homeBadge.trim();
    const hasSaleBadge = Boolean(form.hasSaleBadge);
    const showOnHome = Boolean(form.showOnHome);

    const next = ensureIds(catalog);
    const exists = next.categories.find((c) => c.id === editingId);

    if (exists) {
      next.categories = next.categories.map((c) =>
        c.id === editingId
          ? {
            ...c,
            title,
            slug,
            homeIconUrl,
            homeBadge,
            hasSaleBadge,
            showOnHome,
          }
          : c
      );
    } else {
      next.categories = [
        ...next.categories,
        {
          id: `ucat-${Date.now()}`,
          title,
          slug,
          homeIconUrl,
          homeBadge,
          hasSaleBadge,
          showOnHome,
        },
      ];
    }

    if (next.mode === "single" && next.categories.length > 1) {
      next.categories = [next.categories[0]];
    }

    setCatalog(next);
    saveCatalog(next);
    reset();
  };

  const remove = (id) => {
    if (!window.confirm("Delete this category?")) return;
    const next = { ...catalog, categories: categories.filter((c) => c.id !== id) };
    setCatalog(next);
    saveCatalog(next);
    if (editingId === id) reset();
  };

  return (
    <div className="space-y-8">
      <CardShell icon={FiGrid} title="Service Catalog">
        <div className="space-y-4">
          <div>
            <div className="text-lg font-bold text-gray-900 mb-3">App Mode</div>
            <ModeSelector
              mode={catalog.mode}
              onChange={(mode) => {
                const next = { ...catalog, mode };
                if (mode === "single" && next.categories.length > 1) next.categories = [next.categories[0]];
                setCatalog(next);
                saveCatalog(next);
              }}
            />
          </div>
        </div>
      </CardShell>

      <CardShell icon={FiGrid} title={`Categories (${categories.length})`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">{categories.length} categories</div>
          <button
            onClick={() => {
              reset();
              setIsModalOpen(true);
            }}
            className="px-4 py-2 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg relative z-10"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: '#2874F0',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1e5fd4'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2874F0'}
          >
            <FiPlus className="w-4 h-4" style={{ display: 'block', color: '#ffffff' }} />
            <span>Add Category</span>
          </button>
        </div>
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No categories yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-20">Icon</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Slug</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Badge</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c, idx) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                    <td className="py-4 px-4">
                      {c.homeIconUrl ? (
                        <img src={c.homeIconUrl} alt={c.title} className="h-12 w-12 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-400">No icon</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{c.title || "Untitled"}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">{c.slug || "—"}</div>
                    </td>
                    <td className="py-4 px-4">
                      {c.homeBadge ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">{c.homeBadge}</span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded ${c.showOnHome !== false ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}>
                        {c.showOnHome !== false ? "VISIBLE" : "HIDDEN"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(c.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardShell>

      <Modal
        isOpen={isModalOpen}
        onClose={reset}
        title={editing ? "Edit Category" : "Add Category"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Title</label>
            <input
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((p) => ({ ...p, title, slug: slugify(title) }));
              }}
              placeholder="e.g. Electricity, Salon for Women"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Home Icon</label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm((p) => ({ ...p, homeIconUrl: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {form.homeIconUrl && (
                <img src={form.homeIconUrl} alt="Icon Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Home Badge (optional)</label>
              <input
                value={form.homeBadge}
                onChange={(e) => setForm((p) => ({ ...p, homeBadge: e.target.value }))}
                placeholder="NEW / SALE / etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-3 pt-8">
              <input
                id="hasSaleBadge"
                type="checkbox"
                checked={form.hasSaleBadge}
                onChange={(e) => setForm((p) => ({ ...p, hasSaleBadge: e.target.checked }))}
                className="h-4 w-4"
              />
              <label htmlFor="hasSaleBadge" className="text-base font-semibold text-gray-800">
                Show sale badge on home card
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="showOnHome"
              type="checkbox"
              checked={form.showOnHome}
              onChange={(e) => setForm((p) => ({ ...p, showOnHome: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="showOnHome" className="text-base font-semibold text-gray-800">
              Show this category on home
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={upsert}
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <FiSave className="w-5 h-5" />
              {editing ? "Update Category" : "Add Category"}
            </button>
            <button
              onClick={reset}
              className="px-6 py-3.5 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;

