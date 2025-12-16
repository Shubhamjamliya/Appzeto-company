import React, { useEffect, useState } from "react";
import { FiGrid, FiPlus, FiEdit2, FiTrash2, FiSave, FiLayers, FiPackage } from "react-icons/fi";
import CardShell from "../components/CardShell";
import Modal from "../components/Modal";
import { ensureIds, saveCatalog, slugify } from "../utils";

const SectionsPage = ({ catalog, setCatalog }) => {
  const services = catalog.services || [];
  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const service = services.find((s) => s.id === serviceId) || null;
  const sections = service?.sections || [];
  const [sectionId, setSectionId] = useState(sections[0]?.id || "");
  const section = sections.find((s) => s.id === sectionId) || null;

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [sectionForm, setSectionForm] = useState({
    title: "",
    anchorId: "",
    navImageUrl: "",
    navBadge: "",
    type: "standard",
  });

  const [editingCardId, setEditingCardId] = useState(null);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const emptyCardForm = () => ({
    title: "",
    subtitle: "",
    price: "",
    originalPrice: "",
    discount: "",
    rating: "",
    reviews: "",
    duration: "",
    options: "",
    badge: "",
    description: "",
    featuresText: "",
    imageTextTitleLines: "",
    imageTextSubtitle: "",
    imageUrl: "",
  });
  const [cardForm, setCardForm] = useState(emptyCardForm());

  const resetSectionForm = () => {
    setEditingSectionId(null);
    setSectionForm({ title: "", anchorId: "", navImageUrl: "", navBadge: "", type: "standard" });
    setIsSectionModalOpen(false);
  };

  const resetCardForm = () => {
    setEditingCardId(null);
    setCardForm(emptyCardForm());
    setIsCardModalOpen(false);
  };

  useEffect(() => {
    setServiceId(services[0]?.id || "");
  }, [services.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!service) return;
    const secs = service.sections || [];
    setSectionId(secs[0]?.id || "");
    setEditingSectionId(null);
    setSectionForm({ title: "", anchorId: "", navImageUrl: "", navBadge: "", type: "standard" });
  }, [serviceId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!service) return;
    if (editingSectionId) {
      const s = (service.sections || []).find((x) => x.id === editingSectionId);
      setSectionForm({
        title: s?.title || "",
        anchorId: s?.anchorId || slugify(s?.title || ""),
        navImageUrl: s?.navImageUrl || "",
        navBadge: s?.navBadge || "",
        type: s?.type || "standard",
      });
    } else {
      setSectionForm({ title: "", anchorId: "", navImageUrl: "", navBadge: "", type: "standard" });
    }
  }, [serviceId, editingSectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!section) return;
    if (!editingCardId) {
      setCardForm(emptyCardForm());
      return;
    }
    const card = (section.cards || []).find((k) => k.id === editingCardId);
    setCardForm({
      title: card?.title || "",
      subtitle: card?.subtitle || "",
      price: card?.price ?? "",
      originalPrice: card?.originalPrice ?? "",
      discount: card?.discount || "",
      rating: card?.rating || "",
      reviews: card?.reviews || "",
      duration: card?.duration || "",
      options: card?.options || "",
      badge: card?.badge || "",
      description: card?.description || "",
      featuresText: Array.isArray(card?.features) ? card.features.join("\n") : "",
      imageTextTitleLines: Array.isArray(card?.imageText?.titleLines)
        ? card.imageText.titleLines.join("\n")
        : Array.isArray(card?.imageText?.title)
          ? card.imageText.title.join("\n")
          : "",
      imageTextSubtitle: card?.imageText?.subtitle || "",
      imageUrl: card?.imageUrl || card?.image || "",
    });
  }, [sectionId, editingCardId]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveSection = () => {
    if (!service) return alert("Select a service first");
    const title = sectionForm.title.trim();
    if (!title) return alert("Section title required");
    const anchorId = (sectionForm.anchorId || slugify(title)).trim();
    const navImageUrl = (sectionForm.navImageUrl || "").trim();
    const navBadge = (sectionForm.navBadge || "").trim();
    const type = (sectionForm.type || "standard").trim();

    const next = ensureIds(catalog);
    next.services = next.services.map((s) => {
      if (s.id !== serviceId) return s;
      const sections = Array.isArray(s.sections) ? [...s.sections] : [];
      if (editingSectionId) {
        return {
          ...s,
          sections: sections.map((sec) =>
            sec.id === editingSectionId ? { ...sec, title, anchorId, navImageUrl, navBadge, type } : sec
          ),
        };
      }
      return {
        ...s,
        sections: [
          ...sections,
          { id: `usec-${Date.now()}`, title, anchorId, navImageUrl, navBadge, type, cards: [] },
        ],
      };
    });

    setCatalog(next);
    saveCatalog(next);
    window.dispatchEvent(new Event("adminUserAppCatalogUpdated"));
    resetSectionForm();
  };

  const removeSection = (id) => {
    if (!service) return;
    if (!window.confirm("Delete this section?")) return;
    const next = ensureIds(catalog);
    next.services = next.services.map((s) =>
      s.id === serviceId ? { ...s, sections: (s.sections || []).filter((sec) => sec.id !== id) } : s
    );
    setCatalog(next);
    saveCatalog(next);
    window.dispatchEvent(new Event("adminUserAppCatalogUpdated"));
    if (editingSectionId === id) {
      resetSectionForm();
    }
    if (sectionId === id) {
      const remainingSections = (service.sections || []).filter((sec) => sec.id !== id);
      setSectionId(remainingSections[0]?.id || "");
    }
  };

  const saveCard = () => {
    if (!service) return alert("Select a service first");
    if (!section) return alert("Select a section first");
    const title = cardForm.title.trim();
    if (!title) return alert("Service card title required");

    const subtitle = cardForm.subtitle.trim();
    const description = cardForm.description.trim();
    const imageUrl = cardForm.imageUrl.trim();
    const price = String(cardForm.price ?? "").trim();
    const originalPrice = String(cardForm.originalPrice ?? "").trim();
    const discount = cardForm.discount.trim();
    const rating = String(cardForm.rating ?? "").trim();
    const reviews = String(cardForm.reviews ?? "").trim();
    const duration = cardForm.duration.trim();
    const options = cardForm.options.trim();
    const badge = cardForm.badge.trim();
    const features = (cardForm.featuresText || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const imageTextTitleLines = (cardForm.imageTextTitleLines || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const imageTextSubtitle = cardForm.imageTextSubtitle.trim();
    const imageText = imageTextTitleLines.length || imageTextSubtitle
      ? { titleLines: imageTextTitleLines, subtitle: imageTextSubtitle }
      : null;

    const next = ensureIds(catalog);
    next.services = next.services.map((s) => {
      if (s.id !== serviceId) return s;
      return {
        ...s,
        sections: (s.sections || []).map((sec) => {
          if (sec.id !== sectionId) return sec;
          const cards = Array.isArray(sec.cards) ? [...sec.cards] : [];
          if (editingCardId) {
            return {
              ...sec,
              cards: cards.map((k) =>
                k.id === editingCardId
                  ? {
                    ...k,
                    title,
                    subtitle,
                    price,
                    originalPrice,
                    discount,
                    rating,
                    reviews,
                    duration,
                    options,
                    badge,
                    description,
                    imageUrl,
                    features,
                    imageText,
                  }
                  : k
              ),
            };
          }
          return {
            ...sec,
            cards: [
              ...cards,
              {
                id: `ucard-${Date.now()}`,
                title,
                subtitle,
                price,
                originalPrice,
                discount,
                rating,
                reviews,
                duration,
                options,
                badge,
                description,
                imageUrl,
                features,
                imageText,
              },
            ],
          };
        }),
      };
    });

    setCatalog(next);
    saveCatalog(next);
    window.dispatchEvent(new Event("adminUserAppCatalogUpdated"));
    resetCardForm();
  };

  const removeCard = (id) => {
    if (!service || !section) return;
    if (!window.confirm("Delete this service card?")) return;
    const next = ensureIds(catalog);
    next.services = next.services.map((s) => {
      if (s.id !== serviceId) return s;
      return {
        ...s,
        sections: (s.sections || []).map((sec) =>
          sec.id === sectionId ? { ...sec, cards: (sec.cards || []).filter((k) => k.id !== id) } : sec
        ),
      };
    });
    setCatalog(next);
    saveCatalog(next);
    window.dispatchEvent(new Event("adminUserAppCatalogUpdated"));
    if (editingCardId === id) {
      resetCardForm();
    }
  };

  return (
    <div className="space-y-8">
      <CardShell icon={FiLayers} title="Sections & Service Cards">
        <div className="space-y-5">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">Select Service</label>
            <select
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                resetSectionForm();
                resetCardForm();
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title || "Untitled"}
                </option>
              ))}
            </select>
            {services.length === 0 ? <div className="text-base text-gray-500 mt-2">Add a service first</div> : null}
          </div>
        </div>
      </CardShell>

      <CardShell icon={FiGrid} title={`Sections (${(service?.sections || []).length})`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">{!service ? "Select a service first" : `${(service.sections || []).length} sections`}</div>
          {service && (
            <button
              onClick={() => {
                resetSectionForm();
                setIsSectionModalOpen(true);
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
              <span>Add Section</span>
            </button>
          )}
        </div>
        {!service ? (
          <div className="text-center py-8 text-gray-500">Select a service first</div>
        ) : (service.sections || []).length === 0 ? (
          <div className="text-center py-8 text-gray-500">No sections yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Section Title</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Anchor ID</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-24">Cards</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Badge</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(service.sections || []).map((s, idx) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{s.title || "Untitled"}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600 font-mono">{s.anchorId || "—"}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded">
                        {(s.cards || []).length}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {s.navBadge ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded">{s.navBadge}</span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingSectionId(s.id);
                            setSectionId(s.id);
                            setIsSectionModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeSection(s.id)}
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

      {service && (
        <CardShell icon={FiPackage} title="Service Cards">
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">Select Section</label>
                <select
                  value={sectionId}
                  onChange={(e) => {
                    setSectionId(e.target.value);
                    setEditingCardId(null);
                    setCardForm(emptyCardForm());
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  {(service.sections || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title || "Untitled"}
                    </option>
                  ))}
                </select>
                {!section ? <div className="text-base text-gray-500 mt-2">Add a section first</div> : null}
              </div>
            </div>
          </div>
        </CardShell>
      )}

      {service && section && (
        <CardShell
          icon={FiGrid}
          title={`Service Cards (${(section?.cards || []).length})`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">{(section.cards || []).length} cards</div>
            <button
              onClick={() => {
                resetCardForm();
                setIsCardModalOpen(true);
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
              <span>Add Card</span>
            </button>
          </div>
          {(section.cards || []).length === 0 ? (
            <div className="text-center py-8 text-gray-500">No cards yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-20">Image</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Badge</th>
                    <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(section.cards || []).map((k, idx) => (
                    <tr key={k.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                      <td className="py-4 px-4">
                        {k.imageUrl ? (
                          <img src={k.imageUrl} alt={k.title} className="h-12 w-12 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">No img</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{k.title || "Untitled"}</div>
                        {k.subtitle && <div className="text-xs text-gray-500 mt-1">{k.subtitle}</div>}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-semibold text-gray-900">₹{k.price || "—"}</div>
                        {k.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">₹{k.originalPrice}</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {k.rating ? (
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold">{k.rating}</span>
                            {k.reviews && <span className="text-xs text-gray-500 ml-1">({k.reviews})</span>}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {k.badge ? (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded">{k.badge}</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCardId(k.id);
                              setIsCardModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeCard(k.id)}
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
      )}

      {service && section && (
        <CardShell
          icon={FiGrid}
          title={`Service Cards (${(section?.cards || []).length})`}
        >
          {(section.cards || []).length === 0 ? (
            <div className="text-center py-8 text-gray-500">No cards yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-12">#</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 w-20">Image</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Badge</th>
                    <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(section.cards || []).map((k, idx) => (
                    <tr key={k.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-gray-600">{idx + 1}</td>
                      <td className="py-4 px-4">
                        {k.imageUrl ? (
                          <img src={k.imageUrl} alt={k.title} className="h-12 w-12 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">No img</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{k.title || "Untitled"}</div>
                        {k.subtitle && <div className="text-xs text-gray-500 mt-1">{k.subtitle}</div>}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-semibold text-gray-900">₹{k.price || "—"}</div>
                        {k.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">₹{k.originalPrice}</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {k.rating ? (
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold">{k.rating}</span>
                            {k.reviews && <span className="text-xs text-gray-500 ml-1">({k.reviews})</span>}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {k.badge ? (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded">{k.badge}</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingCardId(k.id)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeCard(k.id)}
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
      )}

      <Modal
        isOpen={isSectionModalOpen}
        onClose={resetSectionForm}
        title={editingSectionId ? "Edit Section" : "Add Section"}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Section Title</label>
              <input
                value={sectionForm.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setSectionForm((p) => ({ ...p, title, anchorId: p.anchorId ? p.anchorId : slugify(title) }));
                }}
                placeholder="e.g. Installation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Anchor ID</label>
              <input
                value={sectionForm.anchorId}
                onChange={(e) => setSectionForm((p) => ({ ...p, anchorId: e.target.value }))}
                placeholder="installation-uninstallation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Nav Image</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setSectionForm((p) => ({ ...p, navImageUrl: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {sectionForm.navImageUrl && (
                  <img src={sectionForm.navImageUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-gray-200" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Nav Badge (optional)</label>
              <input
                value={sectionForm.navBadge}
                onChange={(e) => setSectionForm((p) => ({ ...p, navBadge: e.target.value }))}
                placeholder="Upto 25% OFF"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveSection}
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <FiSave className="w-5 h-5" />
              {editingSectionId ? "Update Section" : "Add Section"}
            </button>
            <button
              onClick={resetSectionForm}
              className="px-6 py-3.5 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCardModalOpen}
        onClose={resetCardForm}
        title={editingCardId ? "Edit Service Card" : "Add Service Card"}
        size="xl"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Title *</label>
              <input
                value={cardForm.title}
                onChange={(e) => setCardForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Fan Repair"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Subtitle (optional)</label>
              <input
                value={cardForm.subtitle}
                onChange={(e) => setCardForm((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="e.g. Roll-on waxing starting at"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Price *</label>
              <input
                value={cardForm.price}
                onChange={(e) => setCardForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="e.g. 199"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Original Price (optional)</label>
              <input
                value={cardForm.originalPrice}
                onChange={(e) => setCardForm((p) => ({ ...p, originalPrice: e.target.value }))}
                placeholder="e.g. 299"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Discount (optional)</label>
              <input
                value={cardForm.discount}
                onChange={(e) => setCardForm((p) => ({ ...p, discount: e.target.value }))}
                placeholder="e.g. 20% OFF"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Duration</label>
              <input
                value={cardForm.duration}
                onChange={(e) => setCardForm((p) => ({ ...p, duration: e.target.value }))}
                placeholder="e.g. 60 mins"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Rating</label>
              <input
                value={cardForm.rating}
                onChange={(e) => setCardForm((p) => ({ ...p, rating: e.target.value }))}
                placeholder="e.g. 4.85"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Reviews</label>
              <input
                value={cardForm.reviews}
                onChange={(e) => setCardForm((p) => ({ ...p, reviews: e.target.value }))}
                placeholder="e.g. 250K"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Badge</label>
              <input
                value={cardForm.badge}
                onChange={(e) => setCardForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder="BESTSELLER / Price Drop"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Options</label>
              <input
                value={cardForm.options}
                onChange={(e) => setCardForm((p) => ({ ...p, options: e.target.value }))}
                placeholder="e.g. 2 options"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Description</label>
            <textarea
              value={cardForm.description}
              onChange={(e) => setCardForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Short description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Features (one per line)</label>
            <textarea
              value={cardForm.featuresText}
              onChange={(e) => setCardForm((p) => ({ ...p, featuresText: e.target.value }))}
              placeholder={"Example:\n- Complete wiring diagnosis\n- Certified technicians"}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Image Text Lines (one per line, optional)</label>
              <textarea
                value={cardForm.imageTextTitleLines}
                onChange={(e) => setCardForm((p) => ({ ...p, imageTextTitleLines: e.target.value }))}
                placeholder={"Boost\nyour skin's\nmoisture"}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">Image Text Subtitle (optional)</label>
              <textarea
                value={cardForm.imageTextSubtitle}
                onChange={(e) => setCardForm((p) => ({ ...p, imageTextSubtitle: e.target.value }))}
                placeholder="Papaya extracts exfoliate & renew"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Image</label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCardForm((p) => ({ ...p, imageUrl: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {cardForm.imageUrl && (
                <div className="mt-2">
                  <img src={cardForm.imageUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-gray-200" />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={saveCard}
              className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <FiSave className="w-5 h-5" />
              {editingCardId ? "Update Service Card" : "Add Service Card"}
            </button>
            <button
              onClick={resetCardForm}
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

export default SectionsPage;
