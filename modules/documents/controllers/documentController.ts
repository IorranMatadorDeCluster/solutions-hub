import { NextResponse } from 'next/server';
import { getCatalogos } from '../services/documentService';

export async function GET() {
  try {
    const catalogos = await getCatalogos();
    return NextResponse.json({ success: true, data: catalogos });
  } catch (error) {
    console.error('❌ Erro no controller:', error);
    return NextResponse.json({ success: false, error: 'Erro ao listar os catálogos.' }, { status: 500 });
  }
}
