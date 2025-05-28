import { Client } from 'minio';

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || '192.168.0.235',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

export async function listDocuments() {
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
      console.error('Erro ao listar:', err);
      reject(err);
    });

    stream.on('end', () => {
      console.log('Listagem concluída.');
      resolve(objectsList);
    });
  });
}
