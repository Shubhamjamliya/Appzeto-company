import React, { useMemo, useState } from "react";
import { FiGrid, FiPlus, FiTrash2, FiSave, FiEdit2 } from "react-icons/fi";
import CardShell from "../components/CardShell";
import Modal from "../components/Modal";
import { ensureIds, saveCatalog, slugify } from "../utils";

const HomePage = ({ catalog, setCatalog }) => {
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({ imageUrl: "", text: "", targetCategoryId: "", scrollToSection: "" });
  const [editingBannerId, setEditingBannerId] = useState(null);

  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({ title: "", subtitle: "", buttonText: "Explore", gradientClass: "from-blue-600 to-blue-800", imageUrl: "", targetCategoryId: "", scrollToSection: "" });
  const [editingPromoId, setEditingPromoId] = useState(null);

  const [isCuratedModalOpen, setIsCuratedModalOpen] = useState(false);
  const [curatedForm, setCuratedForm] = useState({ title: "", gifUrl: "", youtubeUrl: "", targetCategoryId: "" });
  const [editingCuratedId, setEditingCuratedId] = useState(null);

  const [isNoteworthyModalOpen, setIsNoteworthyModalOpen] = useState(false);
  const [noteworthyForm, setNoteworthyForm] = useState({ title: "", imageUrl: "", targetCategoryId: "" });
  const [editingNoteworthyId, setEditingNoteworthyId] = useState(null);

  const [isBookedModalOpen, setIsBookedModalOpen] = useState(false);
  const [bookedForm, setBookedForm] = useState({ title: "", rating: "", reviews: "", price: "", originalPrice: "", discount: "", imageUrl: "", targetCategoryId: "" });
  const [editingBookedId, setEditingBookedId] = useState(null);

  const categories = useMemo(() => {
    const list = ensureIds(catalog).categories || [];
    return [...list].sort((a, b) => {
      const ao = Number.isFinite(a.homeOrder) ? a.homeOrder : 0;
      const bo = Number.isFinite(b.homeOrder) ? b.homeOrder : 0;
      if (ao !== bo) return ao - bo;
      return (a.title || "").localeCompare(b.title || "");
    });
  }, [catalog]);

  const home = ensureIds(catalog).home;

  const getCategoryTitle = (id) => {
    const found = categories.find((c) => c.id === id);
    return found?.title || "";
  };

  const CategoryRedirectSelect = ({ value, onChange, label = "Redirect to service page", help }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">None</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title || "Untitled"}
          </option>
        ))}
      </select>
      {help ? <div className="text-[11px] text-gray-500 mt-1">{help}</div> : null}
    </div>
  );

  const updateCategory = (id, patch) => {
    const next = ensureIds(catalog);
    next.categories = next.categories.map((c) => (c.id === id ? { ...c, ...patch } : c));
    setCatalog(next);
    saveCatalog(next);
  };

  const moveCategory = (id, dir) => {
    const next = ensureIds(catalog);
    const list = [...next.categories].sort((a, b) => (a.homeOrder || 0) - (b.homeOrder || 0));
    const idx = list.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const a = list[idx];
    const b = list[targetIdx];
    const aOrder = a.homeOrder || 0;
    const bOrder = b.homeOrder || 0;
    next.categories = next.categories.map((c) => {
      if (c.id === a.id) return { ...c, homeOrder: bOrder };
      if (c.id === b.id) return { ...c, homeOrder: aOrder };
      return c;
    });
    setCatalog(next);
    saveCatalog(next);
  };

  const setHomeBanners = (banners) => {
    const next = ensureIds(catalog);
    next.home = { ...(next.home || { banners: [] }), banners };
    setCatalog(next);
    saveCatalog(next);
  };

  const patchHome = (patch) => {
    const next = ensureIds(catalog);
    next.home = { ...(next.home || {}), ...patch };
    setCatalog(next);
    saveCatalog(next);
  };

  // Banner handlers
  const resetBannerForm = () => {
    setEditingBannerId(null);
    setBannerForm({ imageUrl: "", text: "", targetCategoryId: "", scrollToSection: "" });
    setIsBannerModalOpen(false);
  };

  const saveBanner = () => {
    const banners = home?.banners || [];
    if (editingBannerId) {
      setHomeBanners(banners.map((b) => (b.id === editingBannerId ? { ...b, ...bannerForm } : b)));
    } else {
      setHomeBanners([...banners, { id: `hbnr-${Date.now()}`, ...bannerForm }]);
    }
    resetBannerForm();
  };

  // Promo handlers
  const resetPromoForm = () => {
    setEditingPromoId(null);
    setPromoForm({ title: "", subtitle: "", buttonText: "Explore", gradientClass: "from-blue-600 to-blue-800", imageUrl: "", targetCategoryId: "", scrollToSection: "" });
    setIsPromoModalOpen(false);
  };

  const savePromo = () => {
    const promos = home?.promoCarousel || [];
    if (editingPromoId) {
      patchHome({ promoCarousel: promos.map((p) => (p.id === editingPromoId ? { ...p, ...promoForm } : p)) });
    } else {
      patchHome({ promoCarousel: [...promos, { id: `hprm-${Date.now()}`, ...promoForm }] });
    }
    resetPromoForm();
  };

  // Curated handlers
  const resetCuratedForm = () => {
    setEditingCuratedId(null);
    setCuratedForm({ title: "", gifUrl: "", youtubeUrl: "", targetCategoryId: "" });
    setIsCuratedModalOpen(false);
  };

  const saveCurated = () => {
    const curated = home?.curatedServices || [];
    if (editingCuratedId) {
      patchHome({ curatedServices: curated.map((c) => (c.id === editingCuratedId ? { ...c, ...curatedForm } : c)) });
    } else {
      patchHome({ curatedServices: [...curated, { id: `hcur-${Date.now()}`, ...curatedForm }] });
    }
    resetCuratedForm();
  };

  // Noteworthy handlers
  const resetNoteworthyForm = () => {
    setEditingNoteworthyId(null);
    setNoteworthyForm({ title: "", imageUrl: "", targetCategoryId: "" });
    setIsNoteworthyModalOpen(false);
  };

  const saveNoteworthy = () => {
    const noteworthy = home?.newAndNoteworthy || [];
    if (editingNoteworthyId) {
      patchHome({ newAndNoteworthy: noteworthy.map((n) => (n.id === editingNoteworthyId ? { ...n, ...noteworthyForm } : n)) });
    } else {
      patchHome({ newAndNoteworthy: [...noteworthy, { id: `hnnw-${Date.now()}`, ...noteworthyForm }] });
    }
    resetNoteworthyForm();
  };

  // Most Booked handlers
  const resetBookedForm = () => {
    setEditingBookedId(null);
    setBookedForm({ title: "", rating: "", reviews: "", price: "", originalPrice: "", discount: "", imageUrl: "", targetCategoryId: "" });
    setIsBookedModalOpen(false);
  };

  const saveBooked = () => {
    const booked = home?.mostBooked || [];
    if (editingBookedId) {
      patchHome({ mostBooked: booked.map((b) => (b.id === editingBookedId ? { ...b, ...bookedForm } : b)) });
    } else {
      patchHome({ mostBooked: [...booked, { id: `hmb-${Date.now()}`, ...bookedForm }] });
    }
    resetBookedForm();
  };

  return (
    <div className="space-y-8">
      <CardShell icon={FiGrid} title="Home Page">
        <div className="space-y-6">
          <div>
            <div className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
              <span>Home Banners</span>
            </div>
            <div className="flex items-center justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  setBannerForm({ imageUrl: "", text: "", targetCategoryId: "", scrollToSection: "" });
                  setIsBannerModalOpen(true);
                }}
                className="px-5 py-3 rounded-xl text-white transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg relative z-10"
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

            {(home?.banners || []).length === 0 ? (
              <div className="text-base text-gray-500">No home banners added</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-24">Image</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Text</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Redirect</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Scroll To</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(home.banners || []).map((b, idx) => (
                      <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                        <td className="py-4 px-4">
                          {b.imageUrl ? (
                            <img src={b.imageUrl} alt="Banner" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No img</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">{b.text || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{b.targetCategoryId ? getCategoryTitle(b.targetCategoryId) : "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{b.scrollToSection || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBannerId(b.id);
                                setBannerForm({ ...b });
                                setIsBannerModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setHomeBanners((home.banners || []).filter((x) => x.id !== b.id))}
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
          </div>
        </div>
      </CardShell>

      <CardShell icon={FiGrid} title="Home Content">
        <div className="space-y-8">
          {/* Promo Carousel (PromoCarousel) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-gray-200">
              <div>
                <div className="text-xl font-bold text-gray-900">Home Promo Carousel</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetPromoForm();
                  setIsPromoModalOpen(true);
                }}
                className="px-5 py-3 rounded-xl text-white transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
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
                <span>Add</span>
              </button>
            </div>

            {(home.promoCarousel || []).length === 0 ? (
              <div className="text-base text-gray-500">No promo cards</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-24">Image</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Subtitle</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Button Text</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Redirect</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(home.promoCarousel || []).map((p, idx) => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                        <td className="py-4 px-4">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt="Promo" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No img</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-semibold text-gray-900">{p.title || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{p.subtitle || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{p.buttonText || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{p.targetCategoryId ? getCategoryTitle(p.targetCategoryId) : "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPromoId(p.id);
                                setPromoForm({ ...p });
                                setIsPromoModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => patchHome({ promoCarousel: (home.promoCarousel || []).filter((x) => x.id !== p.id) })}
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
          </div>

          {/* Curated Services */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-gray-200">
              <div>
                <div className="text-xl font-bold text-gray-900">Thoughtful Curations</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetCuratedForm();
                  setIsCuratedModalOpen(true);
                }}
                className="px-5 py-3 rounded-xl text-white transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
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
                <span>Add</span>
              </button>
            </div>
            {(home.curatedServices || []).length === 0 ? (
              <div className="text-base text-gray-500">No items</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-24">Media</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">YouTube URL</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Redirect</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(home.curatedServices || []).map((s, idx) => (
                      <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                        <td className="py-4 px-4">
                          {s.gifUrl ? (
                            s.gifUrl.match(/\.(gif|webp)$/i) ? (
                              <img src={s.gifUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                            ) : (
                              <video src={s.gifUrl} className="h-16 w-16 object-cover rounded-lg border border-gray-200" controls />
                            )
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No media</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-semibold text-gray-900">{s.title || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{s.youtubeUrl || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{s.targetCategoryId ? getCategoryTitle(s.targetCategoryId) : "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCuratedId(s.id);
                                setCuratedForm({ ...s });
                                setIsCuratedModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => patchHome({ curatedServices: (home.curatedServices || []).filter((x) => x.id !== s.id) })}
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
          </div>

          {/* New & Noteworthy */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-gray-200">
              <div>
                <div className="text-xl font-bold text-gray-900">New & Noteworthy</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetNoteworthyForm();
                  setIsNoteworthyModalOpen(true);
                }}
                className="px-5 py-3 rounded-xl text-white transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
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
                <span>Add</span>
              </button>
            </div>
            {(home.newAndNoteworthy || []).length === 0 ? (
              <div className="text-base text-gray-500">No items</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-24">Image</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Redirect</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(home.newAndNoteworthy || []).map((s, idx) => (
                      <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                        <td className="py-4 px-4">
                          {s.imageUrl ? (
                            <img src={s.imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No img</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-semibold text-gray-900">{s.title || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{s.targetCategoryId ? getCategoryTitle(s.targetCategoryId) : "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNoteworthyId(s.id);
                                setNoteworthyForm({ ...s });
                                setIsNoteworthyModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => patchHome({ newAndNoteworthy: (home.newAndNoteworthy || []).filter((x) => x.id !== s.id) })}
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
          </div>

          {/* Most Booked */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-gray-200">
              <div>
                <div className="text-xl font-bold text-gray-900">Most Booked Services</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetBookedForm();
                  setIsBookedModalOpen(true);
                }}
                className="px-5 py-3 rounded-xl text-white transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
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
                <span>Add</span>
              </button>
            </div>
            {(home.mostBooked || []).length === 0 ? (
              <div className="text-base text-gray-500">No items</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-24">Image</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Reviews</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Original</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Discount</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Redirect</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(home.mostBooked || []).map((s, idx) => (
                      <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                        <td className="py-4 px-4">
                          {s.imageUrl ? (
                            <img src={s.imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No img</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-semibold text-gray-900">{s.title || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{s.rating || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{s.reviews || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-semibold text-gray-900">{s.price ? `₹${s.price}` : "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-500 line-through">{s.originalPrice ? `₹${s.originalPrice}` : "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{s.discount || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{s.targetCategoryId ? getCategoryTitle(s.targetCategoryId) : "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBookedId(s.id);
                                setBookedForm({ ...s });
                                setIsBookedModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => patchHome({ mostBooked: (home.mostBooked || []).filter((x) => x.id !== s.id) })}
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
          </div>

          {/* Category Sections (Cleaning essentials style) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-gray-200">
              <div>
                <div className="text-base font-bold text-gray-800">Category Sections (home)</div>
                <div className="text-xs text-gray-600">Each section renders like â€œCleaning essentialsâ€: title + See all + horizontal cards</div>
              </div>
              <button
                type="button"
                onClick={() =>
                  patchHome({
                    categorySections: [
                      ...(home.categorySections || []),
                      { id: `hsec-${Date.now()}`, title: "", seeAllTargetCategoryId: "", cards: [] },
                    ],
                  })
                }
                className="px-5 py-3 rounded-xl text-white transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
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
                <span>Add Section</span>
              </button>
            </div>

            {(home.categorySections || []).length === 0 ? (
              <div className="text-base text-gray-500">No sections</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Section Title</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">See All Redirect</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-24">Cards</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(home.categorySections || []).map((sec, idx) => (
                      <tr key={sec.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-semibold text-gray-900">{sec.title || "—"}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{sec.seeAllTargetCategoryId ? getCategoryTitle(sec.seeAllTargetCategoryId) : "—"}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded">
                            {(sec.cards || []).length}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                // TODO: Open modal to edit section and cards
                                alert("Edit section functionality - to be implemented with modal");
                              }}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                patchHome({
                                  categorySections: (home.categorySections || []).filter((x) => x.id !== sec.id),
                                })
                              }
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
          </div>
        </div>
      </CardShell>

      <CardShell icon={FiGrid} title="Home Categories">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No categories yet</div>
        ) : (
          <div className="space-y-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-800 truncate">{c.title || "Untitled"}</div>
                    <div className="text-base text-gray-600 truncate">{c.slug || "—"}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveCategory(c.id, "up")}
                      className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-base font-semibold"
                      title="Move up"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCategory(c.id, "down")}
                      className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-base font-semibold"
                      title="Move down"
                    >
                      Down
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      id={`showOnHome-${c.id}`}
                      type="checkbox"
                      checked={c.showOnHome !== false}
                      onChange={(e) => updateCategory(c.id, { showOnHome: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label htmlFor={`showOnHome-${c.id}`} className="text-base font-semibold text-gray-700">
                      Show on home
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Home Icon</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateCategory(c.id, { homeIconUrl: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {c.homeIconUrl && (
                      <img src={c.homeIconUrl} alt="Icon Preview" className="h-12 w-12 object-cover rounded-lg border border-gray-200 mt-2" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Home Badge</label>
                    <input
                      value={c.homeBadge || ""}
                      onChange={(e) => updateCategory(c.id, { homeBadge: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                      placeholder="NEW / SALE"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-5">
                    <input
                      id={`hasSaleBadge-${c.id}`}
                      type="checkbox"
                      checked={Boolean(c.hasSaleBadge)}
                      onChange={(e) => updateCategory(c.id, { hasSaleBadge: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label htmlFor={`hasSaleBadge-${c.id}`} className="text-base font-semibold text-gray-700">
                      Sale badge
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardShell>
      <Modal
        isOpen={isBannerModalOpen}
        onClose={resetBannerForm}
        title={editingBannerId ? "Edit Banner" : "Add Banner"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setBannerForm((p) => ({ ...p, imageUrl: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {bannerForm.imageUrl && (
              <img src={bannerForm.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-gray-200 mt-3" />
            )}
          </div>
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Text (optional)</label>
            <input
              value={bannerForm.text}
              onChange={(e) => setBannerForm((p) => ({ ...p, text: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              placeholder="Winter offers"
            />
          </div>
          <CategoryRedirectSelect
            value={bannerForm.targetCategoryId}
            onChange={(targetCategoryId) => setBannerForm((p) => ({ ...p, targetCategoryId }))}
            label="Redirect to service page (optional)"
          />
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Scroll To Section (optional)</label>
            <input
              value={bannerForm.scrollToSection}
              onChange={(e) => setBannerForm((p) => ({ ...p, scrollToSection: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              placeholder="Waxing & threading"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveBanner}
              className="flex-1 py-3.5 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#2874F0' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e5fd4'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2874F0'}
            >
              <FiSave className="w-5 h-5" />
              {editingBannerId ? "Update Banner" : "Add Banner"}
            </button>
            <button
              onClick={resetBannerForm}
              className="px-6 py-3.5 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isPromoModalOpen}
        onClose={resetPromoForm}
        title={editingPromoId ? "Edit Promo" : "Add Promo"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPromoForm((p) => ({ ...p, imageUrl: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {promoForm.imageUrl && (
              <img src={promoForm.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-gray-200 mt-3" />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Title</label>
              <input
                value={promoForm.title}
                onChange={(e) => setPromoForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="Title"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Subtitle</label>
              <input
                value={promoForm.subtitle}
                onChange={(e) => setPromoForm((p) => ({ ...p, subtitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="Subtitle"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Button Text</label>
              <input
                value={promoForm.buttonText}
                onChange={(e) => setPromoForm((p) => ({ ...p, buttonText: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="Explore"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Gradient Class</label>
              <input
                value={promoForm.gradientClass}
                onChange={(e) => setPromoForm((p) => ({ ...p, gradientClass: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="from-blue-600 to-blue-800"
              />
            </div>
          </div>
          <CategoryRedirectSelect
            value={promoForm.targetCategoryId}
            onChange={(targetCategoryId) => setPromoForm((p) => ({ ...p, targetCategoryId }))}
            label="Redirect to service page (optional)"
          />
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Scroll To Section (optional)</label>
            <input
              value={promoForm.scrollToSection}
              onChange={(e) => setPromoForm((p) => ({ ...p, scrollToSection: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              placeholder="Waxing & threading"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={savePromo}
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#2874F0' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e5fd4'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2874F0'}
            >
              <FiSave className="w-5 h-5" />
              {editingPromoId ? "Update Promo" : "Add Promo"}
            </button>
            <button
              onClick={resetPromoForm}
              className="px-6 py-3.5 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCuratedModalOpen}
        onClose={resetCuratedForm}
        title={editingCuratedId ? "Edit Curated Service" : "Add Curated Service"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Title</label>
            <input
              value={curatedForm.title}
              onChange={(e) => setCuratedForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              placeholder="Bathroom Deep Cleaning"
            />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">GIF/Video</label>
            <input
              type="file"
              accept="image/gif,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setCuratedForm((p) => ({ ...p, gifUrl: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {curatedForm.gifUrl && (
              <div className="mt-3">
                {curatedForm.gifUrl.match(/\.(gif|webp)$/i) ? (
                  <img src={curatedForm.gifUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-gray-200" />
                ) : (
                  <video src={curatedForm.gifUrl} className="h-32 w-32 object-cover rounded-lg border border-gray-200" controls />
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">YouTube URL</label>
            <input
              value={curatedForm.youtubeUrl}
              onChange={(e) => setCuratedForm((p) => ({ ...p, youtubeUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              placeholder="https://youtube.com/..."
            />
          </div>
          <CategoryRedirectSelect
            value={curatedForm.targetCategoryId}
            onChange={(targetCategoryId) => setCuratedForm((p) => ({ ...p, targetCategoryId }))}
            label="Redirect to service page (optional)"
          />
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveCurated}
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#2874F0' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e5fd4'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2874F0'}
            >
              <FiSave className="w-5 h-5" />
              {editingCuratedId ? "Update Curated Service" : "Add Curated Service"}
            </button>
            <button
              onClick={resetCuratedForm}
              className="px-6 py-3.5 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isNoteworthyModalOpen}
        onClose={resetNoteworthyForm}
        title={editingNoteworthyId ? "Edit New & Noteworthy" : "Add New & Noteworthy"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Title</label>
            <input
              value={noteworthyForm.title}
              onChange={(e) => setNoteworthyForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              placeholder="Bathroom & Kitchen Cleaning"
            />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNoteworthyForm((p) => ({ ...p, imageUrl: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {noteworthyForm.imageUrl && (
              <img src={noteworthyForm.imageUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-gray-200 mt-3" />
            )}
          </div>
          <CategoryRedirectSelect
            value={noteworthyForm.targetCategoryId}
            onChange={(targetCategoryId) => setNoteworthyForm((p) => ({ ...p, targetCategoryId }))}
            label="Redirect to service page (optional)"
          />
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveNoteworthy}
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#2874F0' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e5fd4'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2874F0'}
            >
              <FiSave className="w-5 h-5" />
              {editingNoteworthyId ? "Update" : "Add"}
            </button>
            <button
              onClick={resetNoteworthyForm}
              className="px-6 py-3.5 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBookedModalOpen}
        onClose={resetBookedForm}
        title={editingBookedId ? "Edit Most Booked" : "Add Most Booked"}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Title</label>
            <input
              value={bookedForm.title}
              onChange={(e) => setBookedForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              placeholder="Intense cleaning (2 bathrooms)"
            />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setBookedForm((p) => ({ ...p, imageUrl: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {bookedForm.imageUrl && (
              <img src={bookedForm.imageUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-gray-200 mt-3" />
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Rating</label>
              <input
                value={bookedForm.rating}
                onChange={(e) => setBookedForm((p) => ({ ...p, rating: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="4.79"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Reviews</label>
              <input
                value={bookedForm.reviews}
                onChange={(e) => setBookedForm((p) => ({ ...p, reviews: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="3.7M"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Price</label>
              <input
                value={bookedForm.price}
                onChange={(e) => setBookedForm((p) => ({ ...p, price: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="950"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Original Price</label>
              <input
                value={bookedForm.originalPrice}
                onChange={(e) => setBookedForm((p) => ({ ...p, originalPrice: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="1,038"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Discount</label>
              <input
                value={bookedForm.discount}
                onChange={(e) => setBookedForm((p) => ({ ...p, discount: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="8%"
              />
            </div>
          </div>
          <CategoryRedirectSelect
            value={bookedForm.targetCategoryId}
            onChange={(targetCategoryId) => setBookedForm((p) => ({ ...p, targetCategoryId }))}
            label="Redirect to service page (optional)"
          />
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveBooked}
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#2874F0' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e5fd4'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2874F0'}
            >
              <FiSave className="w-5 h-5" />
              {editingBookedId ? "Update" : "Add"}
            </button>
            <button
              onClick={resetBookedForm}
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

export default HomePage;
