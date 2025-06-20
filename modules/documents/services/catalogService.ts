import { listCatalogsWithPresignedUrls, deleteCatalog, renameCatalog, createCatalog } from '../repositories/catalogRepository';

export async function getCatalogs() {
  try {
    const catalogs = await listCatalogsWithPresignedUrls();
    return catalogs;
  } catch (error) {
    console.error('Error in getCatalogs service:', error);
    throw error;
  }
}

export async function removeCatalog(name: string) {
  try {
    await deleteCatalog(name);
  } catch (error) {
    console.error('Error in removeCatalog service:', error);
    throw error;
  }
}

export async function postCatalog(name: string, fileBuffer: Buffer, fileType: string) {
  try {
    await createCatalog(name, fileBuffer, fileType);
  } catch (error) {
    console.error('Error in postCatalog service:', error);
    throw error;
  }
}

export async function updateCatalogName(oldName: string, newName: string): Promise<string> {
  try {   
    const extension = oldName.split('.').pop();

    await renameCatalog(oldName, newName);
    return newName;
  } catch (error) {
    console.error('Error in updateCatalogName service:', error);
    throw error;
  }
}