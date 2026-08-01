import { v2 as cloudinary } from 'cloudinary'
import crypto from 'crypto'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export function generateUploadSignature(timestamp: number) {
  const str = `folder=royal-cars&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
  const signature = crypto.createHash('sha1').update(str).digest('hex')
  return { signature, timestamp, apiKey: process.env.CLOUDINARY_API_KEY!, cloudName: process.env.CLOUDINARY_CLOUD_NAME! }
}
