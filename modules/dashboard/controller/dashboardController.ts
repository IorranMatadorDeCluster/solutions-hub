import { NextResponse } from 'next/server';
// import { sql } from '...'; // se for usar raw SQL futuramente

export async function getDashboardData() {
  // Aqui vai a lógica
  const data = [{ name: 'WhatsApp', sucessos: 312, falhas: 28, respostas: 203 }];
  return NextResponse.json({ data });
}