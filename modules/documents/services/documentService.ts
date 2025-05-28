import { listCatalogos } from '../repositories/documentRepository';

export async function getCatalogos() {
  const catalogos = await listCatalogos();
  return catalogos;
}
