import { uploadFileToMinio, listFilesFromBucket } from '../repositories/catalogRepository';

export async function uploadCatalog(file: File) {
  return await uploadFileToMinio(file);
}

export async function listCatalogs() {
  return await listFilesFromBucket();
}
