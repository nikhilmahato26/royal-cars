import { NextResponse } from 'next/server'
import { generateUploadSignature } from '@/lib/cloudinary'

export async function GET() {
  const timestamp = Math.round(Date.now() / 1000)
  const sig = generateUploadSignature(timestamp)
  return NextResponse.json(sig)
}
