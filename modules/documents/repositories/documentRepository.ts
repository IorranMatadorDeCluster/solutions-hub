import { minioClient } from '@/config/minio';

export async function listCatalogos() {
  return new Promise((resolve, reject) => {
    const objectsList: any[] = [];

    const stream = minioClient.listObjectsV2('catalogos', '', true);

    stream.on('data', (obj) => {
      objectsList.push({
        name: obj.name,
        size: obj.size,
        lastModified: obj.lastModified,
        etag: obj.etag
      });
    });

    stream.on('error', (err) => {
      console.error('❌ Erro ao listar:', err);
      reject(err);
    });

    stream.on('end', () => {
      resolve(objectsList);
    });
  });
}
