import { minioClient } from '@/config/minio';
import { CopyConditions } from 'minio';

interface CatalogFile {
  name: string;
  url: string;
  size: number;
  lastModified: Date;
  type: string; // Add type field
}


const BUCKET = 'catalogos';

export async function listCatalogsWithPresignedUrls(): Promise<CatalogFile[]> {
  const stream = minioClient.listObjectsV2(BUCKET, '', true);
  const files: CatalogFile[] = [];
  
  return new Promise((resolve, reject) => {
    const processData = async (obj: any) => {
      try {
        // Get object metadata to determine content type
        const stat = await minioClient.statObject(BUCKET, obj.name);
        
        // Generate presigned URL with content disposition
        const url = await minioClient.presignedGetObject(
          BUCKET,
          obj.name,
          60 * 60, // 1 hour expiry
          {
            'response-content-disposition': `attachment; filename="${obj.name}"`,
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
        console.error(`Error processing file ${obj.name}:`, error);
      }
    };

    let processPromises: Promise<void>[] = [];

    stream.on('data', (obj) => {
      processPromises.push(processData(obj));
    });

    stream.on('end', async () => {
      try {
        await Promise.all(processPromises);
        console.log('Files found:', files.length); // Debug log
        resolve(files);
      } catch (error) {
        console.error('Error processing files:', error);
        reject(error);
      }
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      reject(err);
    });
  });
}
// Helper function to determine content type
function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const contentTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'ppt': 'application/vnd.ms-powerpoint',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  
  return contentTypes[ext || ''] || 'application/octet-stream';
}


export async function deleteCatalog(name: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET, name);
  } catch (error) {
    console.error('Error deleting catalog:', error);
    throw error;
  }
}

export async function createCatalog(name: string, fileBuffer: Buffer, fileType: string): Promise<void> {
  try {
    // Determine content type based on file extension
    const metaData = {
      'Content-Type': fileType,
      'Content-Disposition': `attachment; filename="${name}"`
    };

    await minioClient.putObject(BUCKET, name, fileBuffer, undefined, metaData);
  } catch (error) {
    console.error('Error creating catalog:', error);
    throw error;
  }
}

export async function renameCatalog(oldName: string, newName: string): Promise<void> {
  try {
    if (oldName === newName) {
      console.log('Old name and new name are the same, skipping rename');
      return;
    }

    // Check if new name already exists
    const exists = await minioClient.statObject(BUCKET, newName).catch(() => false);
    if (exists) {
      throw new Error(`Cannot rename: A catalog with the name "${newName}" already exists`);
    }
    
    // Get source object metadata
    const sourceStats = await minioClient.statObject(BUCKET, oldName);
    
    // Create copy conditions and source path with bucket name
    const copyConditions = new CopyConditions();
    const sourcePath = `${BUCKET}/${oldName}`; // Include bucket name in source path

    await minioClient.copyObject(
      BUCKET,      // destination bucket
      newName,     // new name
      sourcePath,  // source object path with bucket (format: bucketName/objectName)
      copyConditions
    );

    // Delete the old object after successful copy
    await minioClient.removeObject(BUCKET, oldName);
    
    console.log('Successfully renamed catalog from', oldName, 'to', newName);
  } catch (error) {
    console.error('Error renaming catalog:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown error while renaming catalog');
    }
  }
}