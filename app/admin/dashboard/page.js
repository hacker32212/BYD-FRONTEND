'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, resolveImage } from '../../../lib/api';

const TABS = ['hero', 'cars', 'news', 'dealers', 'leads'];
const LOCALES = ['uz', 'ru', 'en'];

function emptyHeroForm() {
  return { title: '', subtitle: '', image: '', link: '', order: 0 };
}

const SPEC_KEYS = ['range', 'power', 'acceleration', 'battery'];
const SPEC_LABELS = { range: 'Запас хода', power: 'Мощность', acceleration: '0-100 км/ч', battery: 'Батарея' };

function emptySpecs() {
  return SPEC_KEYS.flatMap((key) => LOCALES.map((locale) => ({ key, locale, value: '' })));
}

function emptyCarForm() {
  return {
    slug: '',
    priceFrom: '',
    bodyType: '',
    category: 'electric',
    order: 0,
    coverImage: '',
    translations: LOCALES.map((locale) => ({ locale, title: '', subtitle: '', description: '' })),
    specs: emptySpecs(),
  };
}

function emptyNewsForm() {
  return {
    slug: '',
    coverImage: '',
    translations: LOCALES.map((locale) => ({ locale, title: '', excerpt: '', content: '' })),
  };
}

function emptyDealerForm() {
  return {
    phone: '',
    lat: '',
    lng: '',
    translations: LOCALES.map((locale) => ({ locale, city: '', address: '', workHours: '' })),
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState('hero');
  const [hero, setHero] = useState([]);
  const [cars, setCars] = useState([]);
  const [news, setNews] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [leads, setLeads] = useState([]);

  const [heroForm, setHeroForm] = useState(null);
  const [carForm, setCarForm] = useState(null); // null = closed, object = open (with optional id)
  const [newsForm, setNewsForm] = useState(null);
  const [dealerForm, setDealerForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) {
      router.push('/admin/login');
      return;
    }
    setToken(t);
  }, [router]);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }),
    [token]
  );

  const load = useCallback(async () => {
    if (!token) return;
    const [h, c, n, d, l] = await Promise.all([
      fetch(`${API_URL}/hero/admin/all`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API_URL}/cars/admin/all`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API_URL}/news/admin/all`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API_URL}/dealers/admin/all`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API_URL}/leads`, { headers: authHeaders() }).then((r) => r.json()),
    ]);
    setHero(Array.isArray(h) ? h : []);
    setCars(Array.isArray(c) ? c : []);
    setNews(Array.isArray(n) ? n : []);
    setDealers(Array.isArray(d) ? d : []);
    setLeads(Array.isArray(l) ? l : []);
  }, [token, authHeaders]);

  useEffect(() => {
    load();
  }, [load]);

  function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  }

  async function togglePublish(type, item) {
    await fetch(`${API_URL}/${type}/${item.id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ isPublished: !item.isPublished }),
    });
    load();
  }

  async function deleteItem(type, id) {
    if (!confirm('Delete this item?')) return;
    await fetch(`${API_URL}/${type}/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  }

  async function updateLeadStatus(id, status) {
    await fetch(`${API_URL}/leads/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    load();
  }

  // ---------- SHARED IMAGE UPLOAD ----------
  // Загружает выбранный файл на бэкенд (/api/upload) и возвращает относительный
  // URL вида /uploads/xxx.jpg, который затем сохраняется в coverImage/image.
  async function uploadImage(file, onDone) {
    if (!file) return;
    setUploading(true);
    setFormError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onDone(data.url);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  }

  // ---------- HERO FORM ----------
  function openNewHero() {
    setFormError('');
    setHeroForm(emptyHeroForm());
  }

  function openEditHero(slide) {
    setFormError('');
    setHeroForm({
      id: slide.id,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image: slide.image || '',
      link: slide.link || '',
      order: slide.order ?? 0,
    });
  }

  async function saveHero(e) {
    e.preventDefault();
    setFormError('');
    if (!heroForm.title.trim()) {
      setFormError('Title is required');
      return;
    }
    setSaving(true);
    const payload = {
      title: heroForm.title.trim(),
      subtitle: heroForm.subtitle || null,
      image: heroForm.image || null,
      link: heroForm.link || null,
      order: Number(heroForm.order) || 0,
    };
    try {
      const res = await fetch(
        heroForm.id ? `${API_URL}/hero/${heroForm.id}` : `${API_URL}/hero`,
        {
          method: heroForm.id ? 'PUT' : 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setHeroForm(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ---------- CAR FORM ----------
  function openNewCar() {
    setFormError('');
    setCarForm(emptyCarForm());
  }

  function openEditCar(car) {
    setFormError('');
    setCarForm({
      id: car.id,
      slug: car.slug,
      priceFrom: car.priceFrom ?? '',
      bodyType: car.bodyType ?? '',
      category: car.category || 'electric',
      order: car.order ?? 0,
      coverImage: car.coverImage ?? '',
      translations: LOCALES.map((locale) => {
        const existing = car.translations.find((t) => t.locale === locale);
        return existing
          ? { locale, title: existing.title || '', subtitle: existing.subtitle || '', description: existing.description || '' }
          : { locale, title: '', subtitle: '', description: '' };
      }),
      specs: SPEC_KEYS.flatMap((key) =>
        LOCALES.map((locale) => {
          const existing = (car.specs || []).find((s) => s.key === key && s.locale === locale);
          return { key, locale, value: existing?.value || '' };
        })
      ),
    });
  }

  function updateCarSpec(key, locale, value) {
    setCarForm((f) => ({
      ...f,
      specs: f.specs.map((s) => (s.key === key && s.locale === locale ? { ...s, value } : s)),
    }));
  }

  function updateCarTranslation(locale, field, value) {
    setCarForm((f) => ({
      ...f,
      translations: f.translations.map((t) => (t.locale === locale ? { ...t, [field]: value } : t)),
    }));
  }

  async function saveCar(e) {
    e.preventDefault();
    setFormError('');
    if (!carForm.slug.trim()) {
      setFormError('Slug is required');
      return;
    }
    if (!carForm.translations.some((t) => t.title.trim())) {
      setFormError('At least one translation title is required');
      return;
    }
    setSaving(true);
    const payload = {
      slug: carForm.slug.trim(),
      priceFrom: carForm.priceFrom === '' ? null : Number(carForm.priceFrom),
      bodyType: carForm.bodyType || null,
      category: carForm.category || 'electric',
      order: Number(carForm.order) || 0,
      coverImage: carForm.coverImage || null,
      translations: carForm.translations.filter((t) => t.title.trim()),
      specs: carForm.specs.filter((s) => s.value.trim()).map((s) => ({ key: s.key, locale: s.locale, value: s.value.trim() })),
    };
    try {
      const res = await fetch(
        carForm.id ? `${API_URL}/cars/${carForm.id}` : `${API_URL}/cars`,
        {
          method: carForm.id ? 'PUT' : 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setCarForm(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ---------- NEWS FORM ----------
  function openNewNews() {
    setFormError('');
    setNewsForm(emptyNewsForm());
  }

  function openEditNews(post) {
    setFormError('');
    setNewsForm({
      id: post.id,
      slug: post.slug,
      coverImage: post.coverImage ?? '',
      translations: LOCALES.map((locale) => {
        const existing = post.translations.find((t) => t.locale === locale);
        return existing
          ? { locale, title: existing.title || '', excerpt: existing.excerpt || '', content: existing.content || '' }
          : { locale, title: '', excerpt: '', content: '' };
      }),
    });
  }

  function updateNewsTranslation(locale, field, value) {
    setNewsForm((f) => ({
      ...f,
      translations: f.translations.map((t) => (t.locale === locale ? { ...t, [field]: value } : t)),
    }));
  }

  async function saveNews(e) {
    e.preventDefault();
    setFormError('');
    if (!newsForm.slug.trim()) {
      setFormError('Slug is required');
      return;
    }
    if (!newsForm.translations.some((t) => t.title.trim())) {
      setFormError('At least one translation title is required');
      return;
    }
    setSaving(true);
    const payload = {
      slug: newsForm.slug.trim(),
      coverImage: newsForm.coverImage || null,
      translations: newsForm.translations.filter((t) => t.title.trim()),
    };
    try {
      const res = await fetch(
        newsForm.id ? `${API_URL}/news/${newsForm.id}` : `${API_URL}/news`,
        {
          method: newsForm.id ? 'PUT' : 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setNewsForm(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ---------- DEALER FORM ----------
  function openNewDealer() {
    setFormError('');
    setDealerForm(emptyDealerForm());
  }

  function updateDealerTranslation(locale, field, value) {
    setDealerForm((f) => ({
      ...f,
      translations: f.translations.map((t) => (t.locale === locale ? { ...t, [field]: value } : t)),
    }));
  }

  async function saveDealer(e) {
    e.preventDefault();
    setFormError('');
    if (!dealerForm.translations.some((t) => t.city.trim())) {
      setFormError('At least one translation city is required');
      return;
    }
    setSaving(true);
    const cityFallback = dealerForm.translations.find((t) => t.city.trim())?.city || '';
    const payload = {
      city: cityFallback,
      phone: dealerForm.phone || null,
      lat: dealerForm.lat === '' ? null : Number(dealerForm.lat),
      lng: dealerForm.lng === '' ? null : Number(dealerForm.lng),
      translations: dealerForm.translations.filter((t) => t.city.trim()),
    };
    try {
      const res = await fetch(`${API_URL}/dealers`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setDealerForm(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-ink-900">
      <header className="bg-ink-950 border-b border-ink-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={logout} className="text-sm underline">Logout</button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          {TABS.map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`px-4 py-2 rounded-lg capitalize ${
                tab === tb ? 'bg-volt text-ink-950' : 'bg-ink-900 border border-ink-800 text-ink-200'
              }`}
            >
              {tb}
            </button>
          ))}
        </div>

        {tab === 'hero' && (
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-3 flex justify-between items-center">
              <p className="text-xs text-gray-500 px-1">Слайды на главной странице (в порядке Order)</p>
              <button onClick={openNewHero} className="bg-volt text-ink-950 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-volt-soft transition">
                + Add slide
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Photo</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Order</th>
                  <th className="p-3">Published</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hero.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="p-3">
                      {s.image ? (
                        <img src={resolveImage(s.image)} alt={s.title} className="w-16 h-10 object-cover rounded" />
                      ) : (
                        <span className="text-xs text-gray-400">no photo</span>
                      )}
                    </td>
                    <td className="p-3">{s.title}</td>
                    <td className="p-3">{s.order}</td>
                    <td className="p-3">{s.isPublished ? 'Yes' : 'No'}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => openEditHero(s)} className="underline">Edit</button>
                      <button onClick={() => togglePublish('hero', s)} className="underline">
                        {s.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => deleteItem('hero', s.id)} className="text-red-600 underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {hero.length === 0 && (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={5}>Пока нет слайдов — нажмите "+ Add slide".</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'cars' && (
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-3 flex justify-end">
              <button onClick={openNewCar} className="bg-volt text-ink-950 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-volt-soft transition">
                + Add model
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Title (EN)</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Published</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-3">{c.slug}</td>
                    <td className="p-3">{c.translations.find((t) => t.locale === 'en')?.title}</td>
                    <td className="p-3 capitalize">{c.category || 'electric'}</td>
                    <td className="p-3">{c.priceFrom ? `$${c.priceFrom}` : '-'}</td>
                    <td className="p-3">{c.isPublished ? 'Yes' : 'No'}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => openEditCar(c)} className="underline">Edit</button>
                      <button onClick={() => togglePublish('cars', c)} className="underline">
                        {c.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => deleteItem('cars', c.id)} className="text-red-600 underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'news' && (
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-3 flex justify-end">
              <button onClick={openNewNews} className="bg-volt text-ink-950 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-volt-soft transition">
                + Add article
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Title (EN)</th>
                  <th className="p-3">Published</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.id} className="border-t">
                    <td className="p-3">{n.slug}</td>
                    <td className="p-3">{n.translations.find((t) => t.locale === 'en')?.title}</td>
                    <td className="p-3">{n.isPublished ? 'Yes' : 'No'}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => openEditNews(n)} className="underline">Edit</button>
                      <button onClick={() => togglePublish('news', n)} className="underline">
                        {n.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => deleteItem('news', n.id)} className="text-red-600 underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'dealers' && (
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-3 flex justify-end">
              <button onClick={openNewDealer} className="bg-volt text-ink-950 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-volt-soft transition">
                + Add dealer
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">City</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dealers.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-3">{d.city}</td>
                    <td className="p-3">{d.phone}</td>
                    <td className="p-3">
                      <button onClick={() => deleteItem('dealers', d.id)} className="text-red-600 underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'leads' && (
          <div className="bg-white rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="p-3">{l.name}</td>
                    <td className="p-3">{l.phone}</td>
                    <td className="p-3">{l.carModel}</td>
                    <td className="p-3">{l.status}</td>
                    <td className="p-3 flex gap-2">
                      <select
                        value={l.status}
                        onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                      <button onClick={() => deleteItem('leads', l.id)} className="text-red-600 underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* HERO MODAL */}
      {heroForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={saveHero} className="bg-white rounded-xl p-6 max-w-lg w-full my-8">
            <h2 className="text-lg font-bold mb-4">{heroForm.id ? 'Edit slide' : 'New slide'}</h2>
            <input placeholder="Title (e.g. BYD YUAN UP)" value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full mb-3" />
            <input placeholder="Subtitle (optional)" value={heroForm.subtitle}
              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full mb-3" />
            <input placeholder="Link (e.g. /models/yuan-up)" value={heroForm.link}
              onChange={(e) => setHeroForm({ ...heroForm, link: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full mb-3" />
            <input placeholder="Order (sorting number)" type="number" value={heroForm.order}
              onChange={(e) => setHeroForm({ ...heroForm, order: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full mb-3" />

            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Photo</label>
            {heroForm.image && (
              <img src={resolveImage(heroForm.image)} alt="" className="w-full h-40 object-cover rounded-lg mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage(e.target.files?.[0], (url) => setHeroForm((f) => ({ ...f, image: url })))}
              className="border rounded-lg px-3 py-2 w-full mb-3 text-sm"
            />
            {uploading && <p className="text-xs text-gray-500 mb-3">Загрузка фото...</p>}

            {formError && <p className="text-red-600 text-sm mb-3">{formError}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setHeroForm(null)} className="px-4 py-2 rounded-lg border">
                Cancel
              </button>
              <button type="submit" disabled={saving || uploading} className="px-4 py-2 rounded-lg bg-volt text-ink-950 font-semibold hover:bg-volt-soft transition disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CAR MODAL */}
      {carForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={saveCar} className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
            <h2 className="text-lg font-bold mb-4">{carForm.id ? 'Edit model' : 'New model'}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Slug (e.g. model-c-hatch)" value={carForm.slug}
                onChange={(e) => setCarForm({ ...carForm, slug: e.target.value })}
                className="border rounded-lg px-3 py-2 col-span-2" />
              <input placeholder="Price from (USD)" type="number" value={carForm.priceFrom}
                onChange={(e) => setCarForm({ ...carForm, priceFrom: e.target.value })}
                className="border rounded-lg px-3 py-2" />
              <input placeholder="Body type (sedan/suv/...)" value={carForm.bodyType}
                onChange={(e) => setCarForm({ ...carForm, bodyType: e.target.value })}
                className="border rounded-lg px-3 py-2" />
              <select value={carForm.category}
                onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}
                className="border rounded-lg px-3 py-2">
                <option value="electric">Electric (EV)</option>
                <option value="hybrid">Hybrid (PHEV)</option>
              </select>
              <input placeholder="Order (sorting number)" type="number" value={carForm.order}
                onChange={(e) => setCarForm({ ...carForm, order: e.target.value })}
                className="border rounded-lg px-3 py-2" />
              <input placeholder="Cover image URL" value={carForm.coverImage}
                onChange={(e) => setCarForm({ ...carForm, coverImage: e.target.value })}
                className="border rounded-lg px-3 py-2 col-span-2" />
            </div>
            {carForm.coverImage && (
              <img src={resolveImage(carForm.coverImage)} alt="" className="w-full h-40 object-cover rounded-lg mb-3" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage(e.target.files?.[0], (url) => setCarForm((f) => ({ ...f, coverImage: url })))}
              className="border rounded-lg px-3 py-2 w-full mb-4 text-sm"
            />
            {uploading && <p className="text-xs text-gray-500 mb-3">Загрузка фото...</p>}
            {carForm.translations.map((t) => (
              <div key={t.locale} className="border rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">{t.locale}</p>
                <input placeholder="Title" value={t.title}
                  onChange={(e) => updateCarTranslation(t.locale, 'title', e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full mb-2" />
                <input placeholder="Subtitle" value={t.subtitle}
                  onChange={(e) => updateCarTranslation(t.locale, 'subtitle', e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full mb-2" />
                <textarea placeholder="Description" value={t.description} rows={2}
                  onChange={(e) => updateCarTranslation(t.locale, 'description', e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full" />
              </div>
            ))}

            <p className="text-xs font-semibold uppercase text-gray-500 mb-2 mt-4">Характеристики (спец. панель на странице модели)</p>
            <div className="border rounded-lg p-3 mb-3 space-y-3">
              {SPEC_KEYS.map((key) => (
                <div key={key} className="grid grid-cols-4 gap-2 items-center">
                  <span className="text-xs text-gray-500">{SPEC_LABELS[key]}</span>
                  {LOCALES.map((locale) => (
                    <input
                      key={locale}
                      placeholder={locale.toUpperCase()}
                      value={carForm.specs.find((s) => s.key === key && s.locale === locale)?.value || ''}
                      onChange={(e) => updateCarSpec(key, locale, e.target.value)}
                      className="border rounded-lg px-2 py-1.5 text-sm"
                    />
                  ))}
                </div>
              ))}
            </div>

            {formError && <p className="text-red-600 text-sm mb-3">{formError}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setCarForm(null)} className="px-4 py-2 rounded-lg border">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-volt text-ink-950 font-semibold hover:bg-volt-soft transition disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NEWS MODAL */}
      {newsForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={saveNews} className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
            <h2 className="text-lg font-bold mb-4">{newsForm.id ? 'Edit article' : 'New article'}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Slug" value={newsForm.slug}
                onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value })}
                className="border rounded-lg px-3 py-2 col-span-2" />
              <input placeholder="Cover image URL" value={newsForm.coverImage}
                onChange={(e) => setNewsForm({ ...newsForm, coverImage: e.target.value })}
                className="border rounded-lg px-3 py-2 col-span-2" />
            </div>
            {newsForm.coverImage && (
              <img src={resolveImage(newsForm.coverImage)} alt="" className="w-full h-40 object-cover rounded-lg mb-3" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage(e.target.files?.[0], (url) => setNewsForm((f) => ({ ...f, coverImage: url })))}
              className="border rounded-lg px-3 py-2 w-full mb-4 text-sm"
            />
            {uploading && <p className="text-xs text-gray-500 mb-3">Загрузка фото...</p>}
            {newsForm.translations.map((t) => (
              <div key={t.locale} className="border rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">{t.locale}</p>
                <input placeholder="Title" value={t.title}
                  onChange={(e) => updateNewsTranslation(t.locale, 'title', e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full mb-2" />
                <input placeholder="Excerpt" value={t.excerpt}
                  onChange={(e) => updateNewsTranslation(t.locale, 'excerpt', e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full mb-2" />
                <textarea placeholder="Content" value={t.content} rows={3}
                  onChange={(e) => updateNewsTranslation(t.locale, 'content', e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full" />
              </div>
            ))}
            {formError && <p className="text-red-600 text-sm mb-3">{formError}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setNewsForm(null)} className="px-4 py-2 rounded-lg border">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-volt text-ink-950 font-semibold hover:bg-volt-soft transition disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DEALER MODAL */}
      {dealerForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={saveDealer} className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
            <h2 className="text-lg font-bold mb-4">New dealer</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Phone" value={dealerForm.phone}
                onChange={(e) => setDealerForm({ ...dealerForm, phone: e.target.value })}
                className="border rounded-lg px-3 py-2" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Lat" value={dealerForm.lat}
                  onChange={(e) => setDealerForm({ ...dealerForm, lat: e.target.value })}
                  className="border rounded-lg px-3 py-2" />
                <input placeholder="Lng" value={dealerForm.lng}
                  onChange={(e) => setDealerForm({ ...dealerForm, lng: e.target.value })}
                  className="border rounded-lg px-3 py-2" />
              </div>
            </div>
            {dealerForm.translations.map((t) => (
              <div key={t.locale} className="border rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">{t.locale}</p>
                <input placeholder="City" value={t.city}
                  onChange={(e) => updateDealerTranslation(t.locale, 'city', e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full mb-2" />
                <input placeholder="Address" value={t.address}
                  onChange={(e) => updateDealerTranslation(t.locale, 'address', e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full mb-2" />
                <input placeholder="Work hours" value={t.workHours}
                  onChange={(e) => updateDealerTranslation(t.locale, 'workHours', e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full" />
              </div>
            ))}
            {formError && <p className="text-red-600 text-sm mb-3">{formError}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDealerForm(null)} className="px-4 py-2 rounded-lg border">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-volt text-ink-950 font-semibold hover:bg-volt-soft transition disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
