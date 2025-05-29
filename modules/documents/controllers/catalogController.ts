import { NextRequest, NextResponse } from 'next/server';
import { removeCatalog, updateCatalogName, getCatalogs, postCatalog } from '@/modules/documents/services/catalogService';

export async function POST(
  request: NextRequest
) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const fileType = formData.get('fileType') as string;

    if (!file || !fileName) {
      return NextResponse.json(
        { success: false, message: 'File and fileName are required' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for MinIO
    const buffer = Buffer.from(await file.arrayBuffer());
    await postCatalog(fileName, buffer, fileType);

    return NextResponse.json({ 
      success: true,
      message: 'Catalog uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading catalog:', error);
    return NextResponse.json(
      { success: false, message: 'Error uploading catalog' },
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
    console.log('Attempting to delete catalog:', decodedName);

    await removeCatalog(decodedName);

    return NextResponse.json({ 
      success: true,
      message: 'Catalog deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting catalog:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting catalog' },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const catalogs = await getCatalogs();
    return NextResponse.json({ 
      success: true, 
      data: catalogs.map(catalog => ({
        ...catalog,
        lastModified: catalog.lastModified.toISOString()
      }))
    });
  } catch (err) {
    console.error('Error fetching catalogs:', err);
    return NextResponse.json(
      { success: false, message: 'Error fetching catalogs' }, 
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

    console.log('Renaming catalog:', { oldName: params.name, newName });
    const updatedName = await updateCatalogName(params.name, newName);

    return NextResponse.json({
      success: true,
      data: { name: updatedName }
    });
  } catch (error) {
    console.error('Error in rename endpoint:', error);
    return NextResponse.json(
      { success: false, message: 'Error renaming catalog' },
      { status: 500 }
    );
  }
}