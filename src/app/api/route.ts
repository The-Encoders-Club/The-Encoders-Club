import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Welcome to The Encoders Club API',
    version: '2.0.0',
    runtime: 'Cloudflare Workers',
  });
}
