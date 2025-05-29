import { NextResponse, NextRequest } from 'next/server';
import { getCatalogs, removeCatalog, updateCatalogName } from '../services/catalogService';

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    await removeCatalog(params.name);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting catalog:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting catalog' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { newName } = await request.json();
    if (!newName) {
      return NextResponse.json(
        { success: false, message: 'New name is required' },
        { status: 400 }
      );
    }

    const updatedName = await updateCatalogName(params.name, newName);
    return NextResponse.json({ 
      success: true,
      data: { name: updatedName }
    });
  } catch (error) {
    console.error('Error renaming catalog:', error);
    return NextResponse.json(
      { success: false, message: 'Error renaming catalog' },
      { status: 500 }
    );
  }
}