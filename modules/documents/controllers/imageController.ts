import { NextRequest, NextResponse } from 'next/server';
import { getImages, postImage, removeImage, updateImageName } from '@/modules/documents/services/imageService';


export async function GET() {
  try {
    const images = await getImages();
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const fileType = formData.get('fileType') as string;

    if (!file || !fileName) {
      return NextResponse.json(
        { success: false, message: 'File and filename are required' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for MinIO
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await postImage(fileName, buffer, fileType);

    return NextResponse.json({ 
      success: true, 
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    if (!params.name) {
      return NextResponse.json(
        { success: false, message: 'Name parameter is required' },
        { status: 400 }
      );
    }

    const decodedName = decodeURIComponent(params.name);
    await removeImage(decodedName);
    
    return NextResponse.json({ 
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting image' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { name: string } }
) {
  if (!params.name) {
    return NextResponse.json({ success: false, message: 'Name parameter is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { newName } = body;

    if (!newName) {
      return NextResponse.json({ success: false, message: 'New name is required' }, { status: 400 });
    }

    console.log('Renaming image:', { oldName: params.name, newName });
    const updatedName = await updateImageName(params.name, newName);

    return NextResponse.json({
      success: true,
      data: { name: updatedName }
    });
  } catch (error) {
    console.error('Error in rename endpoint:', error);
    return NextResponse.json(
      { success: false, message: 'Error renaming image' },
      { status: 500 }
    );
  }
}