import React, { useEffect, useState } from "react";
import { FiGrid, FiPlus, FiEdit2, FiTrash2, FiSave, FiImage, FiLayers, FiPackage, FiX, FiStar } from "react-icons/fi";
import CardShell from "../components/CardShell";
import Modal from "../components/Modal";
import { ensureIds, saveCatalog, slugify } from "../utils";

const ServicesPage = ({ catalog, setCatalog }) => {
  const services = catalog.services || [];
  const categories = catalog.categories || [];
  const [editingId, setEditingId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const [form, setForm] = useState({
    title: "",
    iconUrl: "",
    badge: "",
    categoryId: categories[0]?.id || "",
  });
  const [pageForm, setPageForm] = useState({
    ratingTitle: "",
    ratingValue: "",
    bookingsText: "",
    paymentOffersEnabled: true,
    banners: [],
    serviceCategoriesGrid: [],
  });

  useEffect(() => {
    if (!editingId) {
      setForm({
        title: "",
        iconUrl: "",
        badge: "",
        categoryId: categories[0]?.id || "",
      });
      return;
    }
    const service = services.find((s) => s.id === editingId);
    if (!service) return;
    const safe = ensureIds({ ...catalog, services: [service] }).services[0];
    setForm({
      title: safe.title || "",
      iconUrl: safe.iconUrl || "",
      badge: safe.badge || "",
      categoryId: safe.categoryId || categories[0]?.id || "",
    });
  }, [editingId, services, categories]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedService) {
      setPageForm({
        ratingTitle: "",
        ratingValue: "",
        bookingsText: "",
        paymentOffersEnabled: true,
        banners: [],
        serviceCategoriesGrid: [],
      });
      return;
    }
    const safe = ensureIds({ ...catalog, services: [selectedService] }).services[0];
    setPageForm({
      ratingTitle: safe.page?.ratingTitle || safe.title || "",
      ratingValue: safe.page?.ratingValue || "",
      bookingsText: safe.page?.bookingsText || "",
      paymentOffersEnabled: safe.page?.paymentOffersEnabled !== false,
      banners: Array.isArray(safe.page?.banners) ? safe.page.banners : [],
      serviceCategoriesGrid: Array.isArray(safe.page?.serviceCategoriesGrid) ? safe.page.serviceCategoriesGrid : [],
    });
  }, [selectedServiceId, services]); // eslint-disable-line react-hooks/exhaustive-deps

  const [isModalOpen, setIsModalOpen] = useState(false);

  const reset = () => {
    setEditingId(null);
    setForm({
      title: "",
      iconUrl: "",
      badge: "",
      categoryId: categories[0]?.id || "",
    });
    setIsModalOpen(false);
  };

  const upsert = () => {
    const title = form.title.trim();
    if (!title) return alert("Service title required");
    if (!form.categoryId) return alert("Select a category");

    const slug = slugify(title);
    const iconUrl = form.iconUrl.trim();
    const badge = form.badge.trim();
    const categoryId = form.categoryId;

    const next = ensureIds(catalog);
    const isNew = !editingId;

    if (isNew) {
      const newService = {
        id: `usvc-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        slug,
        iconUrl,
        badge,
        categoryId,
        routePath: `/user/${slug}`,
        page: {
          banners: [],
          ratingTitle: title,
          ratingValue: "",
          bookingsText: "",
          paymentOffersEnabled: true,
          serviceCategoriesGrid: [],
        },
        sections: [],
      };
      next.services = [...next.services, newService];

      const category = next.categories.find((c) => c.id === categoryId);
      if (category && category.showOnHome) {
        const home = next.home || { categorySections: [] };
        const existingSection = (home.categorySections || []).find(
          (sec) => sec.seeAllTargetCategoryId === categoryId
        );
        if (!existingSection) {
          home.categorySections = [
            ...(home.categorySections || []),
            {
              id: `hsec-${Date.now()}`,
              title: `${title} Essentials`,
              seeAllTargetCategoryId: categoryId,
              cards: [
                {
                  id: `hcard-${Date.now()}`,
                  title,
                  imageUrl: iconUrl,
                  targetCategoryId: categoryId,
                },
              ],
            },
          ];
          next.home = home;
        }
      }
    } else {
      next.services = next.services.map((s) =>
        s.id === editingId
          ? {
            ...s,
            title,
            slug,
            iconUrl,
            badge,
            categoryId,
            routePath: `/user/${slug}`,
          }
          : s
      );
    }

    setCatalog(next);
    saveCatalog(next);
    window.dispatchEvent(new Event("adminUserAppCatalogUpdated"));
    reset();
  };

  const remove = (id) => {
    if (!window.confirm("Delete this service?")) return;
    const next = ensureIds(catalog);
    next.services = next.services.filter((s) => s.id !== id);
    setCatalog(next);
    saveCatalog(next);
    window.dispatchEvent(new Event("adminUserAppCatalogUpdated"));
    if (editingId === id) reset();
    if (selectedServiceId === id) setSelectedServiceId(services.find((s) => s.id !== id)?.id || "");
  };

  const savePageContent = () => {
    if (!selectedService) return alert("Select a service first");
    const next = ensureIds(catalog);
    next.services = next.services.map((s) =>
      s.id === selectedServiceId
        ? {
          ...s,
          page: {
            ...s.page,
            ratingTitle: pageForm.ratingTitle.trim(),
            ratingValue: pageForm.ratingValue.trim(),
            bookingsText: pageForm.bookingsText.trim(),
            paymentOffersEnabled: Boolean(pageForm.paymentOffersEnabled),
            banners: pageForm.banners,
            serviceCategoriesGrid: pageForm.serviceCategoriesGrid,
          },
        }
        : s
    );
    setCatalog(next);
    saveCatalog(next);
    window.dispatchEvent(new Event("adminUserAppCatalogUpdated"));
    alert("Page content saved!");
  };

  const addBanner = () => {
    setPageForm((p) => ({
      ...p,
      banners: [...p.banners, { id: `ubnr-${Date.now()}`, imageUrl: "", text: "" }],
    }));
  };

  const updateBanner = (id, field, value) => {
    setPageForm((p) => ({
      ...p,
      banners: p.banners.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    }));
  };

  const removeBanner = (id) => {
    setPageForm((p) => ({ ...p, banners: p.banners.filter((b) => b.id !== id) }));
  };

  const addServiceCategory = () => {
    setPageForm((p) => ({
      ...p,
      serviceCategoriesGrid: [...p.serviceCategoriesGrid, { id: `ugrd-${Date.now()}`, title: "", imageUrl: "", badge: "" }],
    }));
  };

  const updateServiceCategory = (id, field, value) => {
    setPageForm((p) => ({
      ...p,
      serviceCategoriesGrid: p.serviceCategoriesGrid.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    }));
  };

  const removeServiceCategory = (id) => {
    setPageForm((p) => ({ ...p, serviceCategoriesGrid: p.serviceCategoriesGrid.filter((g) => g.id !== id) }));
  };

  return (
    <div className="space-y-8">
      <CardShell icon={FiGrid} title={`Services (${services.length})`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">{services.length} services</div>
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
            <span>Add Service</span>
          </button>
        </div>
        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No services yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-20">Icon</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Badge</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-24">Sections</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s, idx) => {
                  const category = categories.find((c) => c.id === s.categoryId);
                  return (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                      <td className="py-4 px-4">
                        {s.iconUrl ? (
                          <img src={s.iconUrl} alt={s.title} className="h-12 w-12 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">No icon</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{s.title || "Untitled"}</div>
                        <div className="text-xs text-gray-500 mt-1">{s.routePath || "—"}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-700">{category?.title || "—"}</div>
                      </td>
                      <td className="py-4 px-4">
                        {s.badge ? (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded">{s.badge}</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded">
                          {(s.sections || []).length}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingId(s.id);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => remove(s.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardShell>

      {services.length > 0 && (
        <CardShell icon={FiLayers} title="Page Content">
          <div className="space-y-5">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">Select Service</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title || "Untitled"}
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              <>
                <div className="border-t border-gray-200 pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FiStar className="w-5 h-5 text-primary-600" />
                    <div className="text-xl font-bold text-gray-900">Rating Section</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-base font-bold text-gray-900 mb-2">Rating Title</label>
                      <input
                        value={pageForm.ratingTitle}
                        onChange={(e) => setPageForm((p) => ({ ...p, ratingTitle: e.target.value }))}
                        placeholder="e.g. Electrician"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-gray-900 mb-2">Rating Value</label>
                      <input
                        value={pageForm.ratingValue}
                        onChange={(e) => setPageForm((p) => ({ ...p, ratingValue: e.target.value }))}
                        placeholder="e.g. 4.8"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-gray-900 mb-2">Bookings Text</label>
                      <input
                        value={pageForm.bookingsText}
                        onChange={(e) => setPageForm((p) => ({ ...p, bookingsText: e.target.value }))}
                        placeholder="e.g. 50K+ Bookings"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      id="paymentOffersEnabled"
                      type="checkbox"
                      checked={pageForm.paymentOffersEnabled}
                      onChange={(e) => setPageForm((p) => ({ ...p, paymentOffersEnabled: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <label htmlFor="paymentOffersEnabled" className="text-base font-semibold text-gray-800">
                      Show Payment Offers Card
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FiImage className="w-5 h-5 text-primary-600" />
                      <div className="text-xl font-bold text-gray-900">Banners</div>
                    </div>
                    <button
                      onClick={addBanner}
                      className="px-4 py-2 rounded-xl text-white transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        background: 'linear-gradient(to right, #2874F0, #1e5fd4)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <FiPlus className="w-4 h-4" style={{ display: 'block', color: '#ffffff' }} />
                      <span>Add Banner</span>
                    </button>
                  </div>
                  {pageForm.banners.length === 0 ? (
                    <div className="text-base text-gray-500 text-center py-4">No banners yet</div>
                  ) : (
                    <div className="space-y-4">
                      {pageForm.banners.map((banner) => (
                        <div key={banner.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Image</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        updateBanner(banner.id, "imageUrl", reader.result);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Text (optional)</label>
                                <input
                                  value={banner.text}
                                  onChange={(e) => updateBanner(banner.id, "text", e.target.value)}
                                  placeholder="Banner text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => removeBanner(banner.id)}
                              className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                          {banner.imageUrl && (
                            <div>
                              <img src={banner.imageUrl} alt="Banner" className="h-32 w-full object-cover rounded-lg border border-gray-200" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FiGrid className="w-5 h-5 text-primary-600" />
                      <div className="text-xl font-bold text-gray-900">Service Categories Grid</div>
                    </div>
                    <button
                      onClick={addServiceCategory}
                      className="px-4 py-2 rounded-xl text-white transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        background: 'linear-gradient(to right, #2874F0, #1e5fd4)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <FiPlus className="w-4 h-4" style={{ display: 'block', color: '#ffffff' }} />
                      <span>Add Category</span>
                    </button>
                  </div>
                  {pageForm.serviceCategoriesGrid.length === 0 ? (
                    <div className="text-base text-gray-500 text-center py-4">No categories yet</div>
                  ) : (
                    <div className="space-y-4">
                      {pageForm.serviceCategoriesGrid.map((cat) => (
                        <div key={cat.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Title</label>
                                <input
                                  value={cat.title}
                                  onChange={(e) => updateServiceCategory(cat.id, "title", e.target.value)}
                                  placeholder="Category title"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Image</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        updateServiceCategory(cat.id, "imageUrl", reader.result);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Badge (optional)</label>
                                <input
                                  value={cat.badge}
                                  onChange={(e) => updateServiceCategory(cat.id, "badge", e.target.value)}
                                  placeholder="NEW, SALE"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => removeServiceCategory(cat.id)}
                              className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                          {cat.imageUrl && (
                            <div>
                              <img src={cat.imageUrl} alt={cat.title} className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={savePageContent}
                  className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FiSave className="w-5 h-5" />
                  Save Page Content
                </button>
              </>
            )}
          </div>
        </CardShell>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={reset}
        title={editingId ? "Edit Service" : "Add Service"}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Electrician"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title || "Untitled"}
                  </option>
                ))}
              </select>
              {categories.length === 0 ? <div className="text-base text-gray-500 mt-2">Add a category first</div> : null}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Icon</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm((p) => ({ ...p, iconUrl: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {form.iconUrl && (
                  <div className="mt-2">
                    <img src={form.iconUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Badge (optional)</label>
              <input
                value={form.badge}
                onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder="e.g. NEW, POPULAR"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={upsert}
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <FiSave className="w-5 h-5" />
              {editingId ? "Update Service" : "Add Service"}
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

export default ServicesPage;
