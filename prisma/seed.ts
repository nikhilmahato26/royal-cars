import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const carsToSeed = [
  {
    brand: 'Maruti Suzuki',
    name: 'Dzire New vxi',
    pricePerDay: 2,
    category: 'sedan',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'White',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Bluetooth Connectivity']
  },
  {
    brand: 'Maruti Suzuki',
    name: 'Dzire zxi+',
    pricePerDay: 2,
    category: 'sedan',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Grey',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Touchscreen Infotainment', 'Alloy Wheels']
  },
  {
    brand: 'Maruti Suzuki',
    name: 'Swift New vxi',
    pricePerDay: 2,
    category: 'hatchback',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Red',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Bluetooth Connectivity']
  },
  {
    brand: 'Maruti Suzuki',
    name: 'Swift vxi',
    pricePerDay: 2,
    category: 'hatchback',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Silver',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags']
  },
  {
    brand: 'Honda',
    name: 'Amaze New',
    pricePerDay: 2,
    category: 'sedan',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Brown',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Rear Parking Sensors']
  },
  {
    brand: 'Tata',
    name: 'Punch',
    pricePerDay: 2,
    category: 'suv',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Orange',
    features: ['Air Conditioner', 'ABS', 'Dual Airbags', 'High Ground Clearance', 'ISOFIX Child Seat Mounts']
  },
  {
    brand: 'Maruti Suzuki',
    name: 'Fronx',
    pricePerDay: 2,
    category: 'suv',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Blue',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Touchscreen Infotainment']
  },
  {
    brand: 'Hyundai',
    name: 'Aura',
    pricePerDay: 2,
    category: 'sedan',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'White',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Rear Parking Camera']
  },
  {
    brand: 'Maruti Suzuki',
    name: 'Baleno',
    pricePerDay: 2,
    category: 'hatchback',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Blue',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Keyless Entry', 'Push Button Start']
  },
  {
    brand: 'Hyundai',
    name: 'i20',
    pricePerDay: 2,
    category: 'hatchback',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Silver',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Touchscreen Infotainment', 'Electric Sunroof']
  },
  {
    brand: 'Maruti Suzuki',
    name: 'Ertiga',
    pricePerDay: 2,
    category: 'muv',
    seats: 7,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'White',
    features: ['Rear AC Vents', 'Power Windows', 'ABS', 'Dual Airbags', 'Steering Mounted Controls', 'Rear Parking Sensors']
  },
  {
    brand: 'Hyundai',
    name: 'Venue',
    pricePerDay: 2,
    category: 'suv',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Grey',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Touchscreen Infotainment', 'Reverse Camera']
  },
  {
    brand: 'Hyundai',
    name: 'Creta',
    pricePerDay: 2,
    category: 'suv',
    seats: 5,
    fuelType: 'diesel',
    transmission: 'manual',
    color: 'Black',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Touchscreen Infotainment', 'Alloy Wheels', 'Electric Sunroof']
  },
  {
    brand: 'Hyundai',
    name: 'Exter Auto',
    pricePerDay: 2,
    category: 'suv',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'automatic',
    color: 'Khaki',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Automatic Transmission', 'Dashcam']
  },
  {
    brand: 'Maruti Suzuki',
    name: 'Grand Vitara',
    pricePerDay: 2,
    category: 'suv',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Silver',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Touchscreen Infotainment', 'Panoramic Sunroof']
  },
  {
    brand: 'Hyundai',
    name: 'Grand i10 Nios',
    pricePerDay: 2,
    category: 'hatchback',
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Grey',
    features: ['Air Conditioner', 'Power Windows', 'ABS', 'Dual Airbags', 'Bluetooth Connectivity']
  },
  {
    brand: 'Mahindra',
    name: 'Scorpio Classic',
    pricePerDay: 2,
    category: 'suv',
    seats: 7,
    fuelType: 'diesel',
    transmission: 'manual',
    color: 'Black',
    features: ['Powerful mHawk Engine', 'Rear AC Vents', 'ABS', 'Dual Airbags', 'High Ground Clearance']
  },
  {
    brand: 'Mahindra',
    name: 'Scorpio-N',
    pricePerDay: 2,
    category: 'suv',
    seats: 7,
    fuelType: 'diesel',
    transmission: 'automatic',
    color: 'Gold',
    features: ['mHawk Engine', 'Dual Zone AC', 'ABS', 'Multiple Airbags', 'Sunroof', 'Automatic Transmission', '4WD Options']
  },
  {
    brand: 'Mahindra',
    name: 'Thar 4WD',
    pricePerDay: 2,
    category: 'suv',
    seats: 4,
    fuelType: 'diesel',
    transmission: 'manual',
    color: 'Red',
    features: ['4x4 Drivetrain', 'ABS', 'Dual Airbags', 'All Terrain Tires', 'Removable Roof']
  }
]

async function main() {
  // 1. Seed Admin Account
  const hash = await bcrypt.hash('RoyalCars@2024!', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@royalcars.in' },
    update: {},
    create: {
      email: 'admin@royalcars.in',
      passwordHash: hash,
      name: 'Royal Cars Admin',
    },
  })
  console.log('Admin seeded: admin@royalcars.in / RoyalCars@2024!')

  // 2. Seed Cars
  for (const car of carsToSeed) {
    const slug = `${car.brand.toLowerCase().replace(/\s+/g, '-')}-${car.name.toLowerCase().replace(/\s+/g, '-')}`
    
    await prisma.car.upsert({
      where: { slug },
      update: {
        pricePerDay: car.pricePerDay,
        category: car.category,
        seats: car.seats,
        fuelType: car.fuelType,
        transmission: car.transmission,
        color: car.color,
        features: car.features,
      },
      create: {
        slug,
        brand: car.brand,
        name: car.name,
        pricePerDay: car.pricePerDay,
        category: car.category,
        seats: car.seats,
        fuelType: car.fuelType,
        transmission: car.transmission,
        color: car.color,
        images: [],
        features: car.features,
        isActive: true
      }
    })
    console.log(`Car seeded or updated: ${car.brand} ${car.name} (Price: ${car.pricePerDay})`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
