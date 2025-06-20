import { minioClient } from '@/config/minio';
import { CopyConditions } from 'minio';

export interface ImageFile {
  name: string;
  url: string;
  size: number;
  lastModified: string;
  type: string;
}

const BUCKET = 'imagens';

// Update content types for images
function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const contentTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff'
  };
  
  return contentTypes[ext || ''] || 'application/octet-stream';
}

export async function listImages(): Promise<ImageFile[]> {
  const stream = minioClient.listObjectsV2(BUCKET, '', true);
  const files: ImageFile[] = [];
  
  return new Promise((resolve, reject) => {
    const processData = async (obj: any) => {
      try {
        const stat = await minioClient.statObject(BUCKET, obj.name);
        
        // Generate presigned URL with proper content type for images
        const url = await minioClient.presignedGetObject(
          BUCKET,
          obj.name,
          60 * 60, // 1 hour expiry
          {
            'response-content-type': stat.metaData['content-type'] || getContentType(obj.name)
          }
        );

        files.push({
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          url,
          type: stat.metaData['content-type'] || getContentType(obj.name)
        });
      } catch (error) {
        console.error(`Error processing image ${obj.name}:`, error);
      }
    };

    let processPromises: Promise<void>[] = [];

    stream.on('data', (obj) => {
      processPromises.push(processData(obj));
    });

    stream.on('end', async () => {
      try {
        await Promise.all(processPromises);
        console.log('Images found:', files.length);
        resolve(files);
      } catch (error) {
        console.error('Error processing images:', error);
        reject(error);
      }
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      reject(err);
    });
  });
}

export async function createImage(name: string, fileBuffer: Buffer, fileType: string): Promise<void> {
  try {
    // Ensure bucket exists
    const exists = await minioClient.bucketExists(BUCKET);
    if (!exists) {
      await minioClient.makeBucket(BUCKET);
      console.log(`Created bucket: ${BUCKET}`);
    }

    const metaData = {
      'Content-Type': fileType || getContentType(name),
      'Content-Disposition': `inline; filename="${name}"`
    };

    await minioClient.putObject(BUCKET, name, fileBuffer, undefined, metaData);
  } catch (error) {
    console.error('Error creating image:', error);
    throw error;
  }
}

export async function renameImage(oldName: string, newName: string): Promise<void> {
  try {
    if (oldName === newName) {
      console.log('Old name and new name are the same, skipping rename');
      return;
    }

    const exists = await minioClient.statObject(BUCKET, newName).catch(() => false);
    if (exists) {
      throw new Error(`Cannot rename: An image with the name "${newName}" already exists`);
    }
    
    const sourceStats = await minioClient.statObject(BUCKET, oldName);
    const copyConditions = new CopyConditions();
    const sourcePath = `/${BUCKET}/${oldName}`; // Added leading slash

    await minioClient.copyObject(
      BUCKET,
      newName,
      sourcePath,
      copyConditions
    );

    await minioClient.removeObject(BUCKET, oldName);
    
    console.log('Successfully renamed image from', oldName, 'to', newName);
  } catch (error) {
    console.error('Error renaming image:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown error while renaming image');
    }
  }
}

export async function deleteImage(name: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET, name);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}