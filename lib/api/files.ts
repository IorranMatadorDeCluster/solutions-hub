export async function fetchCatalogs() {
  const res = await fetch('/api/files/catalogs', { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Erro ao buscar catálogos');
  }

  return res.json();
}