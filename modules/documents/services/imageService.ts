import { listImages, deleteImage, renameImage, createImage } from '../repositories/imageRepository';

export async function getImages() {
  try {
    const images = await listImages();
    return images;
  } catch (error) {
    console.error('Error in getCatalogs service:', error);
    throw error;
  }
}

export async function removeImage(name: string) {
  try {
    await deleteImage(name);
  } catch (error) {
    console.error('Error in removeCatalog service:', error);
    throw error;
  }
}

export async function postImage(name: string, fileBuffer: Buffer, fileType: string) {
  try {
    await createImage(name, fileBuffer, fileType);
  } catch (error) {
    console.error('Error in postCatalog service:', error);
    throw error;
  }
}

export async function updateImageName(oldName: string, newName: string): Promise<string> {
  try {   
    // Extract extension from old name
    const extension = oldName.split('.').pop();
    
    // Ensure new name has the same extension
    const newNameWithExt = !newName.endsWith(`.${extension}`) 
      ? `${newName}.${extension}`
      : newName;

    console.log('Updating image name:', {
      oldName,
      newName: newNameWithExt,
      extension
    });

    await renameImage(oldName, newNameWithExt);
    return newNameWithExt;
  } catch (error) {
    console.error('Error in updateImageName service:', error);
    throw error;
  }
}