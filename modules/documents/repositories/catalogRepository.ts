import { minioClient } from '@/config/minio';

interface CatalogFile {
  name: string;
  url: string;
  size: number;
  lastModified: Date;
}

const BUCKET = 'catalogos';

export async function listCatalogsWithPresignedUrls(): Promise<CatalogFile[]> {
  const stream = minioClient.listObjectsV2(BUCKET, '', true);
  const files: CatalogFile[] = [];

  return new Promise((resolve, reject) => {
    stream.on('data', async (obj) => {
      const url = await minioClient.presignedUrl('GET', BUCKET, obj.name, 60 * 60); // 1h

      files.push({
        name: obj.name,
        size: obj.size,
        lastModified: obj.lastModified,
        url,
      });
    });

    stream.on('end', () => resolve(files));
    stream.on('error', reject);
  });
}

export async function deleteCatalog(name: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET, name);
  } catch (error) {
    console.error('Error deleting catalog:', error);
    throw error;
  }
}

export async function renameCatalog(oldName: string, newName: string): Promise<void> {
  try {
    // MinIO requires source path to be URL encoded
    const sourceObject = encodeURIComponent(`${BUCKET}/${oldName}`);
    
    // Copy the object with the new name
    await minioClient.copyObject(BUCKET, newName, sourceObject);
    
    // Delete the old object
    await minioClient.removeObject(BUCKET, oldName);
  } catch (error) {
    console.error('Error renaming catalog:', error);
    throw error;
  }
}