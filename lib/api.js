const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
// Бэкенд отдаёт загруженные файлы (/uploads/...) как отдельный статический путь,
// не под /api — поэтому для картинок нужен origin без хвоста /api.
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

// Превращает относительный путь вида "/uploads/xxx.jpg", который отдаёт бэкенд
// после загрузки файла, в полный URL. Абсолютные (http...) ссылки не трогает.
export function resolveImage(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url}`;
}

export async function fetchCars(locale) {
  const res = await fetch(`${API_URL}/cars?locale=${locale}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

// Алиас: app/[locale]/page.js и app/[locale]/models/page.js импортируют getCars
export async function getCars(locale = 'ru') {
  return fetchCars(locale);
}

export async function fetchCar(slug, locale) {
  const res = await fetch(`${API_URL}/cars/${slug}?locale=${locale}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

// Алиас: app/[locale]/models/[slug]/page.js импортирует getCarBySlug
export async function getCarBySlug(slug, locale = 'ru') {
  return fetchCar(slug, locale);
}

export async function fetchNews(locale) {
  const res = await fetch(`${API_URL}/news?locale=${locale}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchNewsPost(slug, locale) {
  const res = await fetch(`${API_URL}/news/${slug}?locale=${locale}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchDealers(locale) {
  const res = await fetch(`${API_URL}/dealers?locale=${locale}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function getHeroSlides() {
  const res = await fetch(`${API_URL}/hero`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function submitLead(data) {
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return { ok: res.ok, data: await res.json() };
}

// Алиас для форм: приводит поля формы (model/note) к полям, которые ждёт
// бэкенд (carModel/message), и бросает ошибку при неуспехе, как ожидает ContactForm.
export async function createLead({ name, phone, model, note, carModel, message }) {
  const { ok, data } = await submitLead({
    name,
    phone,
    carModel: carModel ?? model ?? null,
    message: message ?? note ?? null,
  });
  if (!ok) throw new Error(data?.error || 'Не удалось отправить заявку');
  return data;
}

// Возвращает модели, разбитые по категории (electric/hybrid) — используется
// в шапке (мега-меню "Modellari") и в футере.
export function splitByCategory(cars) {
  return {
    electric: cars.filter((c) => (c.category || 'electric') === 'electric'),
    hybrid: cars.filter((c) => c.category === 'hybrid'),
  };
}

export { API_URL };
