import { minioClient } from '@/config/minio';
import { prisma } from '@/config/prisma';

async function checkMinio() {
  try {
    const buckets = await minioClient.listBuckets();
    console.log('✅ MinIO conectado. Buckets:', buckets.map(b => b.name));
  } catch (err) {
    console.error('❌ Erro no MinIO:', err);
  }
}

async function checkDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Banco de dados conectado.');
  } catch (err) {
    console.error('❌ Erro no banco de dados:', err);
  } finally {
    await prisma.$disconnect();
  }
}

async function runHealthCheck() {
  console.log('🔍 Iniciando health check...\n');

  await checkMinio();
  await checkDatabase();

  console.log('\n🔗 Health check finalizado.');
}

runHealthCheck();
