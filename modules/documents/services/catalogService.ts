import { listCatalogsWithPresignedUrls, deleteCatalog, renameCatalog } from '../repositories/catalogRepository';

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

export async function updateCatalogName(oldName: string, newName: string): Promise<string> {
  try {
    // Keep the original file extension
    const extension = oldName.split('.').pop();
    const newNameWithExtension = newName.endsWith(`.${extension}`) 
      ? newName 
      : `${newName}.${extension}`;

    await renameCatalog(oldName, newNameWithExtension);
    return newNameWithExtension;
  } catch (error) {
    console.error('Error in updateCatalogName service:', error);
    throw error;
  }
}