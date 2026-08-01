'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { 
  CheckCircle, 
  Star, 
  Shield, 
  Zap, 
  ChevronRight, 
  Car, 
  Users, 
  Fuel, 
  Settings, 
  MapPin, 
  Calendar, 
  Search, 
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  MessageSquare,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  Award,
  Clock,
  Play,
  Smartphone,
  Check
} from 'lucide-react'

// Hardcoded premium cars matching the design screenshot
const mostSearchedCars = [
  {
    id: 1,
    brand: 'Volkswagen',
    name: 'Golf GTD 2.0 TDI',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop',
    rating: '4.96',
    reviews: '572 reviews',
    location: 'Manchester, England',
    miles: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '498.25'
  },
  {
    id: 2,
    brand: 'Audi',
    name: 'A3 1.6 TDI S line',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=600&auto=format&fit=crop',
    rating: '4.96',
    reviews: '572 reviews',
    location: 'Manchester, England',
    miles: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '498.25'
  },
  {
    id: 3,
    brand: 'Mercedes-Benz',
    name: 'C220d',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop',
    rating: '4.96',
    reviews: '572 reviews',
    location: 'Manchester, England',
    miles: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '498.25'
  },
  {
    id: 4,
    brand: 'Lexus',
    name: 'IS 300h F Sport',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop',
    rating: '4.96',
    reviews: '572 reviews',
    location: 'Manchester, England',
    miles: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '498.25'
  },
  {
    id: 5,
    brand: 'Volvo',
    name: 'S60 D4 R-Design',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
    rating: '4.96',
    reviews: '572 reviews',
    location: 'New South Wales, Australia',
    miles: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '498.25'
  },
  {
    id: 6,
    brand: 'Jaguar',
    name: 'XE 2.0d R-Sport',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop',
    rating: '4.96',
    reviews: '572 reviews',
    location: 'Manchester, England',
    miles: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '498.25'
  }
]





export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [dbCars, setDbCars] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(6)
  
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const carsSectionRef = useRef<HTMLElement>(null)
  const pickupInputRef = useRef<HTMLInputElement>(null)
  const returnInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSearch = async () => {
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!pickupLocation.trim()) errors.pickupLocation = 'Required';
    if (!dropoffLocation.trim()) errors.dropoffLocation = 'Required';
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsLoading(true)
    try {
      const url = new URL('/api/cars', window.location.origin)
      if (pickupDate) url.searchParams.set('startDate', new Date(pickupDate).toISOString())
      if (returnDate) url.searchParams.set('endDate', new Date(returnDate).toISOString())
      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json()
        setDbCars(data)
      }
    } catch (err) {
      console.error('Error fetching cars:', err)
    } finally {
      setIsLoading(false)
      if (carsSectionRef.current) {
        const yOffset = -80 // Offset for fixed navbar if any
        const element = carsSectionRef.current
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await fetch('/api/cars')
        if (res.ok) {
          const data = await res.json()
          setDbCars(data)
        }
      } catch (err) {
        console.error('Error fetching cars:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCars()
  }, [])

  const carsToRender = dbCars.length > 0 ? dbCars : mostSearchedCars

  const distinctBrands = dbCars.length > 0
    ? Array.from(new Set(dbCars.map((car) => car.brand)))
    : ['Maruti Suzuki', 'Hyundai', 'Mahindra', 'Tata', 'Honda']

  // Dynamic categories
  const distinctCategories = Array.from(new Set(carsToRender.map((car) => (car.category || '').toLowerCase())))

  const getCategoryDetails = (category: string) => {
    let title = category.toUpperCase()
    let image = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=300' // fallback
    
    if (category === 'sedan') {
      title = 'Sedan'
      image = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=300&auto=format&fit=crop'
    } else if (category === 'hatchback') {
      title = 'Hatchback'
      image = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=300&auto=format&fit=crop'
    } else if (category === 'suv') {
      title = 'SUV'
      image = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=300&auto=format&fit=crop'
    } else if (category === 'muv') {
      title = 'MUV'
      image = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=300&auto=format&fit=crop'
    }

    const count = carsToRender.filter((car) => (car.category || '').toLowerCase() === category).length
    return { title, image, count: `${count} Car${count !== 1 ? 's' : ''}` }
  }

  // Dynamic featured listings (top 3 highest price cars)
  const featuredCars = dbCars.length > 0
    ? [...dbCars].sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay)).slice(0, 3)
    : [
        {
          id: 'mock-1',
          brand: 'Mahindra',
          name: 'Scorpio N Z8L',
          pricePerDay: '3800',
          category: 'suv',
          slug: 'mahindra-scorpio-n-z8l'
        },
        {
          id: 'mock-2',
          brand: 'Mahindra',
          name: 'Thar LX 4WD',
          pricePerDay: '3500',
          category: 'suv',
          slug: 'mahindra-thar-lx-4wd'
        },
        {
          id: 'mock-3',
          brand: 'Maruti Suzuki',
          name: 'Ertiga VXI',
          pricePerDay: '2400',
          category: 'muv',
          slug: 'maruti-suzuki-ertiga-vxi'
        }
      ]

  // Rental cost estimator state
  const [selectedEstimatorCarId, setSelectedEstimatorCarId] = useState('')
  const [estimatorDailyRate, setEstimatorDailyRate] = useState(1700)
  const [rentalDays, setRentalDays] = useState(3)
  const [includeDelivery, setIncludeDelivery] = useState(false)
  const [includeInsurance, setIncludeInsurance] = useState(false)

  // Initialize selected car once carsToRender has elements
  useEffect(() => {
    if (carsToRender.length > 0 && !selectedEstimatorCarId) {
      const firstCar = carsToRender[0];
      setSelectedEstimatorCarId(firstCar.id);
      setEstimatorDailyRate(Number(typeof firstCar.pricePerDay === 'object' ? firstCar.pricePerDay.toString() : (firstCar.pricePerDay || firstCar.price)));
    }
  }, [carsToRender, selectedEstimatorCarId])

  const calculateTotalCost = () => {
    let subtotal = estimatorDailyRate * rentalDays;
    if (includeInsurance) {
      subtotal += 300 * rentalDays;
    }
    if (includeDelivery) {
      subtotal += 500;
    }
    
    // Apply multi-day discount
    let discount = 0;
    if (rentalDays >= 15) {
      discount = 0.15;
    } else if (rentalDays >= 7) {
      discount = 0.10;
    }
    
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;
    return {
      total: Math.round(total),
      discountPercent: discount * 100,
      discountAmount: Math.round(discountAmount)
    }
  }

  return (
    <div className="bg-[#0a0c10] text-[#f5f5f5] font-sans overflow-x-hidden min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[95vh] pt-36 lg:pt-48 flex flex-col justify-between pb-10">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/90/Bird_view_of_Jagannath_Temple%2C_Puri.jpg" 
            alt="Bird view of Jagannath Temple, Puri" 
            className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
          {/* Green Pill Subtitle */}
          <div className="inline-flex items-center gap-2 bg-[#22c55e]/15 border border-[#22c55e]/30 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles size={14} className="text-[#22c55e]" />
            <span className="text-[#22c55e] text-xs font-semibold uppercase tracking-wider">Find Your Perfect Car</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mb-8">
            Looking for a vehicle<br />
            in <span className="text-[#22c55e]">Bhubaneswar?</span>
          </h1>

          {/* Checkmarks */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-12">
            {[
              'High quality at a low cost',
              'Premium services',
              '24/7 roadside support'
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#22c55e]/20 flex items-center justify-center border border-[#22c55e]/30">
                  <Check size={12} className="text-[#22c55e] stroke-[3]" />
                </div>
                <span className="text-gray-200 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search widget overlapping bottom of hero */}
        <div className="relative z-15 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto">
          <div className="w-full bg-[#0a0c10]/40 backdrop-blur-lg rounded-3xl p-1 border border-[#1b2b28]/20 shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
            
            {/* Inputs grid inside a white background container */}
            <div className="bg-white text-gray-800 rounded-2xl p-5 m-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end shadow-inner">
              
              {/* Field 1: Pickup Location */}
              <div className="flex flex-col border-b md:border-b-0 lg:border-r border-gray-100 pr-2 pb-4 md:pb-0">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex justify-between">
                  <span>Pickup Location</span>
                  {fieldErrors.pickupLocation && <span className="text-red-500 lowercase normal-case">{fieldErrors.pickupLocation}</span>}
                </label>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#22c55e] shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Enter city or airport" 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="bg-transparent text-sm font-bold text-gray-900 border-none outline-none w-full placeholder:text-gray-400 focus:ring-0 p-0"
                  />
                </div>
              </div>

              {/* Field 2: Dropoff Location */}
              <div className="flex flex-col border-b md:border-b-0 lg:border-r border-gray-100 pr-2 pb-4 md:pb-0">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex justify-between">
                  <span>Drop-off Location</span>
                  {fieldErrors.dropoffLocation && <span className="text-red-500 lowercase normal-case">{fieldErrors.dropoffLocation}</span>}
                </label>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#22c55e] shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Enter city or airport" 
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="bg-transparent text-sm font-bold text-gray-900 border-none outline-none w-full placeholder:text-gray-400 focus:ring-0 p-0"
                  />
                </div>
              </div>

              {/* Field 3: Pick Up Date & Time */}
              <div className="flex flex-col border-b md:border-b-0 lg:border-r border-gray-100 pr-2 pb-4 md:pb-0">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Pick Up Date & Time</label>
                <div 
                  className="flex items-center gap-2 cursor-pointer relative"
                  onClick={() => {
                    try { pickupInputRef.current?.showPicker?.(); } catch (e) {}
                  }}
                >
                  <Calendar size={18} className="text-[#22c55e] shrink-0 pointer-events-none" />
                  <input 
                    ref={pickupInputRef}
                    type="datetime-local" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      try { e.currentTarget.showPicker?.(); } catch(err) {}
                    }}
                    className="bg-transparent text-sm font-bold text-gray-900 border-none outline-none w-full cursor-pointer focus:ring-0 p-0 [&::-webkit-calendar-picker-indicator]:hidden"
                  />
                </div>
              </div>

              {/* Field 4: Return Date & Time */}
              <div className="flex flex-col lg:border-r border-gray-100 pr-2 pb-4 lg:pb-0">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Return Date & Time</label>
                <div 
                  className="flex items-center gap-2 cursor-pointer relative"
                  onClick={() => {
                    try { returnInputRef.current?.showPicker?.(); } catch (e) {}
                  }}
                >
                  <Calendar size={18} className="text-[#22c55e] shrink-0 pointer-events-none" />
                  <input 
                    ref={returnInputRef}
                    type="datetime-local" 
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      try { e.currentTarget.showPicker?.(); } catch(err) {}
                    }}
                    className="bg-transparent text-sm font-bold text-gray-900 border-none outline-none w-full cursor-pointer focus:ring-0 p-0 [&::-webkit-calendar-picker-indicator]:hidden"
                  />
                </div>
              </div>

              {/* Field 5: Select Car Button */}
              <div className="flex flex-col justify-end">
                <button 
                  onClick={handleSearch}
                  className="bg-[#22c55e] hover:bg-[#1bb853] text-black font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] w-full flex justify-center items-center h-[46px]"
                >
                  Select Car
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. Premium Brands */}
      <section className="py-20 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Premium Brands</h2>
              <p className="text-gray-400 text-sm">Unveil the Finest Selection of High-End Vehicles</p>
            </div>
            <Link href="/fleet" className="text-[#22c55e] hover:text-white font-bold text-sm flex items-center gap-1.5 transition-colors mt-4 md:mt-0">
              <span>Show All Brands</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {distinctBrands.map((brandName) => (
              <Link 
                key={brandName}
                href={`/fleet?brand=${encodeURIComponent(brandName)}`}
                className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#22c55e]/25 rounded-2xl py-4.5 px-4 flex items-center justify-center gap-3 transition-all duration-300 group cursor-pointer w-full"
              >
                <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-[#22c55e]/15 flex items-center justify-center shrink-0 transition-all">
                  <Car size={16} className="text-gray-400 group-hover:text-[#22c55e] transition-colors" />
                </div>
                <span className="text-xs sm:text-[14px] font-bold text-gray-300 group-hover:text-white transition-colors truncate">{brandName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Most Searched Vehicles */}
      <section ref={carsSectionRef} className="py-20 bg-[#0d0f14] border-y border-[#1b2b28]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Most Searched Vehicles</h2>
              <p className="text-gray-400 text-sm">The world&apos;s leading car brands.</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:border-[#22c55e] text-gray-400 hover:text-white transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:border-[#22c55e] text-gray-400 hover:text-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#0b0c10] border border-[#1b2b28]/10 rounded-3xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-gray-900/50" />
                  <div className="p-6">
                    <div className="h-6 w-3/4 bg-gray-900/50 rounded mb-1.5" />
                    <div className="h-4 w-1/2 bg-gray-900/50 rounded mb-5" />
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 border-b border-[#1b2b28]/15 pb-5 mb-5">
                      <div className="h-4 w-20 bg-gray-900/50 rounded" />
                      <div className="h-4 w-20 bg-gray-900/50 rounded" />
                      <div className="h-4 w-20 bg-gray-900/50 rounded" />
                      <div className="h-4 w-20 bg-gray-900/50 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-24 bg-gray-900/50 rounded" />
                      <div className="h-10 w-24 bg-gray-900/50 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              carsToRender.slice(0, visibleCount).map((car) => {
              const id = car.id;
              const brand = car.brand;
              const name = car.name;
              const isRealDbCar = typeof id === 'string'; // CUID is a string, mock id is a number

              // Images fallback for real DB cars
              let carImage = car.image; // mock car image fallback
              if (isRealDbCar) {
                if (car.images && car.images.length > 0) {
                  carImage = car.images[0];
                } else {
                  const categoryLower = (car.category || '').toLowerCase();
                  const nameLower = (car.name || '').toLowerCase();
                  if (categoryLower === 'hatchback') {
                    carImage = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop';
                  } else if (categoryLower === 'sedan') {
                    carImage = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop';
                  } else if (categoryLower === 'muv') {
                    carImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop';
                  } else {
                    // SUV or other
                    if (nameLower.includes('thar')) {
                      carImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop';
                    } else if (nameLower.includes('scorpio')) {
                      carImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop';
                    } else {
                      carImage = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop';
                    }
                  }
                }
              }

              // Ratings
              const rating = isRealDbCar ? (4.8 + (id.charCodeAt(0) % 3) * 0.1).toFixed(2) : car.rating;
              const reviewsCount = isRealDbCar ? `${100 + (id.charCodeAt(id.length - 1) % 800)} reviews` : car.reviews;

              // Location
              const location = isRealDbCar ? 'Bhubaneswar, India' : car.location;

              // Specs
              const miles = isRealDbCar ? '15,000 km' : car.miles;
              const transmission = car.transmission; // automatic or manual
              const fuelType = car.fuelType || car.fuel;
              const seats = isRealDbCar ? `${car.seats} seats` : car.seats;

              // Price
              const price = isRealDbCar ? car.pricePerDay : car.price;
              const isAvailable = isRealDbCar ? (car.available !== false) : true;

              return (
                <div 
                  key={id} 
                  className={`bg-[#0b0c10] border border-[#1b2b28]/10 rounded-3xl overflow-hidden transition-all duration-300 group ${isAvailable ? 'hover:border-[#22c55e]/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]' : 'opacity-50 grayscale'}`}
                >
                  {/* Image Section */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-gray-900">
                    <img 
                      src={carImage} 
                      alt={`${brand} ${name}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {/* Rating Overlay */}
                    <div className="absolute top-4 left-4 bg-[#0a0c10]/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/5">
                      <Star size={12} className="text-[#22c55e] fill-[#22c55e]" />
                      <span>{rating}</span>
                      <span className="text-gray-400">({reviewsCount.split(' ')[0]})</span>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-6">
                    {/* Title & Brand */}
                    <h3 className="font-extrabold text-xl text-white group-hover:text-[#22c55e] transition-colors mb-1.5">
                      {brand} {name}
                    </h3>
                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-5">
                      <MapPin size={12} className="text-[#22c55e]" />
                      <span>{location}</span>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 border-b border-[#1b2b28]/15 pb-5 mb-5 text-gray-300 text-xs">
                      <div className="flex items-center gap-2">
                        <Car size={14} className="text-gray-500" />
                        <span>{miles}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings size={14} className="text-gray-500" />
                        <span className="capitalize">{transmission}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel size={14} className="text-gray-500" />
                        <span className="capitalize">{fuelType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-500" />
                        <span>{seats}</span>
                      </div>
                    </div>

                    {/* Card Footer: Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 text-xs">From</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-white text-xl font-extrabold">₹{price}</span>
                          <span className="text-gray-400 text-xs">/day</span>
                        </div>
                      </div>
                      {isAvailable ? (
                        <Link 
                          href={(() => {
                            let carUrl = isRealDbCar ? `/fleet/${car.slug || id}` : '/fleet';
                            const query = new URLSearchParams();
                            if (pickupLocation) query.append('pickupLocation', pickupLocation);
                            if (dropoffLocation) query.append('dropoffLocation', dropoffLocation);
                            if (pickupDate) {
                              const d = new Date(pickupDate);
                              query.append('startDate', d.toISOString().slice(0, 10));
                              query.append('startTime', d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                            }
                            if (returnDate) {
                              const d = new Date(returnDate);
                              query.append('endDate', d.toISOString().slice(0, 10));
                              query.append('endTime', d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                            }
                            return query.toString() ? `${carUrl}?${query.toString()}` : carUrl;
                          })()}
                          className="border border-[#22c55e]/30 hover:bg-[#22c55e] hover:text-black text-[#22c55e] text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                        >
                          Book Now
                        </Link>
                      ) : (
                        <button 
                          disabled
                          className="border border-gray-600 bg-gray-800 text-gray-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed"
                        >
                          Unavailable
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              )
            })
          )}
          </div>

          {visibleCount < carsToRender.length && (
            <div className="text-center">
              <button 
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="bg-[#22c55e] hover:bg-[#1bb853] text-black font-extrabold px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
              >
                Load More Cars
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. Value Proposition / Rental Process Section */}
      <section className="py-20 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Premium car showcase image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-900 shadow-2xl border border-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop" 
                  alt="Premium Mahindra Scorpio self-drive vehicle" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Right details */}
            <div className="lg:pl-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                Bhubaneswar&apos;s Premium<br />
                <span className="text-[#22c55e]">Self-Drive Experience</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Choose private self-drive freedom for your Bhubaneswar journeys. We offer a simple online booking flow, premium clean cars, and local doorstep assistance with no hidden security deposit worries.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Select your preferred car model from our dynamic fleet',
                  'Verify with OTP and book in less than two minutes',
                  'Enjoy transparent doorstep deliveries directly to hotel or airport'
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-[#22c55e]/15 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-[#22c55e]" />
                    </div>
                    <span className="text-gray-200 text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/fleet" className="bg-[#22c55e] hover:bg-[#1bb853] text-black font-extrabold px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.3)] transition-all cursor-pointer inline-block text-center">
                Explore Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Browse by Type */}
      <section className="py-20 bg-[#0d0f14] border-t border-[#1b2b28]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Browse by Type</h2>
              <p className="text-gray-400 text-sm">Explore our diverse range of vehicles.</p>
            </div>
            <Link href="/fleet" className="text-[#22c55e] hover:text-white font-bold text-sm flex items-center gap-1.5 transition-colors mt-4 md:mt-0">
              <span>Show All Types</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {distinctCategories.map((category) => {
              const details = getCategoryDetails(category)
              return (
                <Link 
                  key={category} 
                  href={`/fleet?category=${category}`}
                  className="bg-[#0b0c10] border border-[#1b2b28]/10 rounded-2xl p-5 hover:border-[#22c55e]/30 transition-all duration-300 text-center group cursor-pointer block"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-900">
                    <img src={details.image} alt={details.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  </div>
                  <h4 className="font-extrabold text-white text-base group-hover:text-[#22c55e] transition-colors">{details.title}</h4>
                  <span className="text-xs text-gray-500">{details.count}</span>
                </Link>
              )
            })}
          </div>

        </div>
      </section>

      {/* 6. Value Proposition Section */}
      <section className="py-20 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Presenting Your New Go-To<br />
              Car Rental Experience
            </h2>
            <p className="text-gray-400 text-sm">Premium quality standards and support tailored to your journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award size={32} className="text-[#22c55e]" />,
                title: 'Diverse & Selected Fleet',
                desc: 'Every vehicle undergoes a thorough 150-point quality check and is detail-cleaned prior to booking keys delivery.'
              },
              {
                icon: <DollarSign size={32} className="text-[#22c55e]" />,
                title: 'No Hidden Fees',
                desc: 'Transparent pricing with rental rates covering comprehensive insurance packages. What you see is what you pay.'
              },
              {
                icon: <Clock size={32} className="text-[#22c55e]" />,
                title: '24/7 Premium Support',
                desc: 'Get roadside assistance, emergency repair dispatches, and responsive chat agent support at any time of day.'
              }
            ].map((prop, idx) => (
              <div key={idx} className="bg-[#0b0c10] border border-[#1b2b28]/10 rounded-3xl p-8 hover:border-[#22c55e]/20 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-[#22c55e]/15 flex items-center justify-center mb-6 transition-colors">
                  {prop.icon}
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-[#22c55e] transition-colors">{prop.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Trip Cost Estimator */}
      <section className="py-20 bg-[#070c0c] border-y border-[#1b2b28]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Info details & stats */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                Want to Estimate Your<br />
                <span className="text-[#22c55e]">Rental Trip Cost?</span>
              </h2>
              <p className="text-gray-400 mb-10 leading-relaxed max-w-lg">
                Select a vehicle and adjust your rental duration to calculate your estimated total trip cost. Clear, upfront rates with no hidden fees.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '19+', label: 'Seeded Vehicles' },
                  { value: '24/7', label: 'Emergency Support' },
                  { value: '100%', label: 'Transparent Rates' }
                ].map((stat, idx) => (
                  <div key={idx} className="border-l-2 border-[#22c55e] pl-4">
                    <div className="text-2xl font-extrabold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive form box */}
            <div className="bg-[#0b0c10] border border-[#1b2b28]/15 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-extrabold text-white mb-6 border-b border-[#1b2b28]/10 pb-4">Trip Cost Estimator</h3>
              
              <div className="space-y-5">
                {/* Select Car */}
                <div>
                  <label className="block text-xs text-gray-400 font-bold mb-1.5 uppercase">Select Vehicle</label>
                  <select
                    value={selectedEstimatorCarId}
                    onChange={(e) => {
                      setSelectedEstimatorCarId(e.target.value);
                      const car = carsToRender.find(c => c.id === e.target.value);
                      if (car) {
                        setEstimatorDailyRate(Number(typeof car.pricePerDay === 'object' ? car.pricePerDay.toString() : car.pricePerDay));
                      }
                    }}
                    className="bg-[#0b0c10] border border-gray-800 text-white rounded-xl py-3.5 px-4 w-full outline-none focus:border-[#22c55e] text-sm font-semibold cursor-pointer"
                  >
                    {carsToRender.map((car) => {
                      const price = typeof car.pricePerDay === 'object' ? car.pricePerDay.toString() : car.pricePerDay;
                      return (
                        <option key={car.id} value={car.id}>
                          {car.brand} {car.name} (₹{price}/day)
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Days slider */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-300">Rental Duration</span>
                    <span className="text-white font-extrabold">{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    step="1" 
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    className="w-full accent-[#22c55e] bg-gray-800 rounded-lg cursor-pointer h-1.5"
                  />
                </div>

                {/* Optional Add-ons Checkboxes */}
                <div className="space-y-3 pt-2 text-left border-t border-[#1b2b28]/10">
                  <span className="block text-xs text-gray-450 font-bold uppercase tracking-wider">Optional Trip Add-Ons</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-300 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={includeDelivery} 
                        onChange={(e) => setIncludeDelivery(e.target.checked)} 
                        className="w-4 h-4 rounded accent-[#22c55e] bg-gray-850 border-gray-700 cursor-pointer focus:ring-0 focus:ring-offset-0"
                      />
                      <span>Doorstep Delivery (+₹500)</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-300 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={includeInsurance} 
                        onChange={(e) => setIncludeInsurance(e.target.checked)} 
                        className="w-4 h-4 rounded accent-[#22c55e] bg-gray-850 border-gray-700 cursor-pointer focus:ring-0 focus:ring-offset-0"
                      />
                      <span>Full Cover Insurance (+₹300/day)</span>
                    </label>
                  </div>
                </div>

                {/* Output Box */}
                {(() => {
                  const { total, discountPercent, discountAmount } = calculateTotalCost();
                  return (
                    <div className="bg-[#22c55e]/10 border border-[#22c55e]/25 rounded-2xl p-5 mt-6 text-center">
                      <span className="text-gray-400 text-xs font-semibold block mb-1">Estimated Total Cost</span>
                      <div className="text-3xl font-extrabold text-[#22c55e]">₹{total.toLocaleString()}</div>
                      {discountPercent > 0 && (
                        <span className="text-xs text-[#22c55e] block mt-1.5 font-bold uppercase tracking-wider">
                          Includes {discountPercent}% discount (-₹{discountAmount})
                        </span>
                      )}
                    </div>
                  );
                })()}

                <Link
                  href={selectedEstimatorCarId ? `/fleet/${carsToRender.find(c => c.id === selectedEstimatorCarId)?.slug || ''}` : '/fleet'}
                  className="bg-[#22c55e] hover:bg-[#1bb853] text-black font-extrabold w-full py-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(34,197,94,0.2)] mt-2 cursor-pointer block text-center"
                >
                  Proceed with Booking
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Featured Listings */}
      <section className="py-20 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Featured Listings</h2>
              <p className="text-gray-400 text-sm">Discover top-rated vehicles handpicked by our experts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map((car) => {
              const id = car.id;
              const brand = car.brand;
              const name = car.name;
              const slug = car.slug;
              const isRealDbCar = typeof id === 'string';
              const price = isRealDbCar ? typeof car.pricePerDay === 'object' ? car.pricePerDay.toString() : car.pricePerDay : car.pricePerDay;

              // Image resolving logic
              let carImage = '';
              if (isRealDbCar && car.images && car.images.length > 0) {
                carImage = car.images[0];
              } else {
                const categoryLower = (car.category || '').toLowerCase();
                const nameLower = (car.name || '').toLowerCase();
                if (categoryLower === 'hatchback') {
                  carImage = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop';
                } else if (categoryLower === 'sedan') {
                  carImage = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop';
                } else if (categoryLower === 'muv') {
                  carImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop';
                } else {
                  if (nameLower.includes('thar')) {
                    carImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop';
                  } else if (nameLower.includes('scorpio')) {
                    carImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop';
                  } else {
                    carImage = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop';
                  }
                }
              }

              const rating = isRealDbCar ? (4.8 + (id.charCodeAt(0) % 3) * 0.1).toFixed(2) : '4.95';

              return (
                <div key={id} className="bg-[#0d0f14] border border-[#1b2b28]/10 rounded-2xl overflow-hidden hover:border-[#22c55e]/25 transition-all group">
                  <div className="aspect-[16/9] relative overflow-hidden bg-gray-900">
                    <img src={carImage} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-[#0a0c10]/80 px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={10} className="text-[#22c55e] fill-[#22c55e]" />
                      <span>{rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-[#22c55e] text-xs font-bold uppercase">{brand}</span>
                    <h4 className="font-extrabold text-lg text-white mb-3">{name}</h4>
                    <div className="flex items-center justify-between border-t border-gray-900 pt-4">
                      <div>
                        <span className="text-gray-400 text-xs">Rate</span>
                        <div className="font-bold text-white">₹{price}/day</div>
                      </div>
                      <Link href={`/fleet/${slug}`} className="text-xs font-bold text-[#22c55e] hover:text-white transition-colors flex items-center gap-1">
                        <span>Rent Now</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* 9. Long-Term Rental Subscriptions Banner */}
      <section className="py-12 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#142321] to-[#0c1313] border border-[#22c55e]/20 rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center overflow-hidden relative">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Save More with Long-Term<br />
                Rental Subscriptions
              </h2>
              <p className="text-gray-400 text-sm mb-6 max-w-md">
                Need a car for a week, a month, or longer? Save up to 30% off our standard daily rates with free doorstep maintenance and full coverage support included.
              </p>
              <div className="flex gap-4">
                <Link href="/fleet" className="bg-[#22c55e] hover:bg-[#1bb853] text-black font-extrabold px-6 py-3 rounded-xl transition-all cursor-pointer block text-center">
                  Explore Fleet
                </Link>
                <Link href="/contact" className="border border-gray-700 hover:border-[#22c55e] text-white font-bold px-6 py-3 rounded-xl transition-all block text-center">
                  Enquire Now
                </Link>
              </div>
            </div>

            {/* Collage mockup */}
            <div className="relative h-48 lg:h-full flex items-center justify-end">
              <div className="w-40 h-28 rounded-xl overflow-hidden absolute rotate-[-6deg] translate-x-[-120px] translate-y-[-20px] shadow-2xl border border-white/5">
                <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=300" className="w-full h-full object-cover" alt="Car mockup 1" />
              </div>
              <div className="w-44 h-32 rounded-xl overflow-hidden absolute rotate-[4deg] z-10 shadow-2xl border border-white/5">
                <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=300" className="w-full h-full object-cover" alt="Car mockup 2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Gallery */}
      <section id="gallery" className="py-20 bg-[#0d0f14] border-t border-[#1b2b28]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-3">Our Gallery</h2>
            <p className="text-gray-400 text-sm">Take a look at our premium fleet, meticulously detailed and ready for your next trip.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Mahindra Thar 4WD', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600' },
              { title: 'Premium SUV Segment', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600' },
              { title: 'Maruti Suzuki Swift', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600' },
              { title: 'Comfort Sedan Class', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600' },
              { title: 'Ertiga MUV Class', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600' },
              { title: 'Premium Showroom Class', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 border border-[#1b2b28]/10 hover:border-[#22c55e]/25 relative group transition-all duration-300 cursor-pointer shadow-lg"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div>
                    <h4 className="text-white font-extrabold text-base leading-tight mb-1">{item.title}</h4>
                    <span className="text-xs text-[#22c55e] font-semibold">Self-Drive Fleet</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Testimonials */}
      <section className="py-20 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">What they say about us?</h2>
              <p className="text-gray-400 text-sm">Customer feedback outlining rental satisfaction and vehicle standards.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Jenkins',
                role: 'Enterprise Client',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
                review: 'Cleanest Golf GTD I have ever rented. Booking took less than 4 minutes, and key pick-up was extremely straightforward.',
                rating: 5
              },
              {
                name: 'David Carter',
                role: 'Tour Manager',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
                review: 'Amazing client support! Roadside assistance responded within 15 minutes when we had standard tire checks. Will use again.',
                rating: 5
              },
              {
                name: 'Marcus Vance',
                role: 'Weekend Traveler',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
                review: 'Transparent pricing with absolutely zero unexpected charges. Insured cars in pristine mechanical condition.',
                rating: 5
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-[#0b0c10] border border-[#1b2b28]/10 rounded-2xl p-6 relative hover:border-[#22c55e]/20 transition-all duration-300">
                <div className="flex gap-0.5 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">&ldquo;{t.review}&rdquo;</p>
                
                <div className="flex items-center gap-3 border-t border-gray-900 pt-4">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-white text-sm">{t.name}</h5>
                    <span className="text-xs text-gray-500">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 12. Upcoming Cars & Events (Blog) */}
      <section className="py-20 bg-[#0d0f14] border-t border-[#1b2b28]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Upcoming Cars & Events</h2>
              <p className="text-gray-400 text-sm">Stay updated with standard updates from our showroom blog.</p>
            </div>
            <Link href="#" className="text-[#22c55e] hover:text-white font-bold text-sm flex items-center gap-1.5 transition-colors mt-4 md:mt-0">
              <span>View All News</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                date: 'Oct 14, 2024',
                title: 'New Audi RS models joining the premium category soon',
                image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=400',
                desc: 'A sneak peek inside our upcoming performance segment expansion plan.'
              },
              {
                date: 'Oct 08, 2024',
                title: 'Self Drive road safety guidelines for winter season driving',
                image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=400',
                desc: 'Important tips for ensuring traction control and proper tire calibration.'
              },
              {
                date: 'Sep 25, 2024',
                title: 'Tesla Model S Plaid booking now open for selected areas',
                image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=400',
                desc: 'We are expanding our zero emission luxury vehicle rentals to more hub locations.'
              }
            ].map((blog, idx) => (
              <div key={idx} className="bg-[#0b0c10] border border-[#1b2b28]/10 rounded-2xl overflow-hidden group hover:border-[#22c55e]/25 transition-all duration-300 cursor-pointer">
                <div className="aspect-[16/10] bg-gray-900 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <span className="text-[#22c55e] text-xs font-bold">{blog.date}</span>
                  <h4 className="font-extrabold text-white text-base mt-2 mb-3 leading-snug group-hover:text-[#22c55e] transition-colors">{blog.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{blog.desc}</p>
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1 group-hover:text-white transition-colors">
                    <span>Read Article</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 13. Brand Promotion Banner */}
      <section className="py-12 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#17c25c] to-[#12a64c] text-black rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
            {/* Background glowing circle */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-20 translate-y-[-20px] blur-3xl pointer-events-none" />

            <div className="max-w-xl relative z-10">
              <span className="bg-black/15 text-black text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block mb-4">
                Premium Self-Drive
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                Hassle-Free Car Rentals<br />
                in Bhubaneswar
              </h2>
              <p className="text-black/85 text-sm mb-6 leading-relaxed">
                Choose from our wide range of clean, well-maintained self-drive vehicles. We offer doorstep delivery, 24/7 roadside assistance, and completely transparent pricing with zero hidden charges.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/fleet" className="bg-black hover:bg-gray-900 text-white flex items-center justify-center font-bold px-6 py-3.5 rounded-xl transition-all shadow-md">
                  Explore Our Fleet
                </Link>
                <a href="tel:9777824577" className="bg-white/20 hover:bg-white/30 text-black border border-black/10 flex items-center justify-center font-bold px-6 py-3.5 rounded-xl transition-all">
                  Book on Call: 9777824577
                </a>
              </div>
            </div>

            {/* Features panel */}
            <div className="relative w-full max-w-sm shrink-0 relative z-10 bg-black/10 border border-black/10 rounded-2xl p-6 backdrop-blur-sm">
              <h4 className="font-extrabold text-lg text-black mb-4">The Royal Guarantee</h4>
              <div className="space-y-3.5">
                {[
                  { title: 'Doorstep Delivery', desc: 'Car delivered directly to your location' },
                  { title: 'Clean & Sanitized', desc: 'Fully detailed prior to every rental handoff' },
                  { title: 'Unlimited KMs Options', desc: 'Drive as far as your adventure takes you' },
                  { title: '24/7 Roadside Support', desc: 'Round-the-clock emergency support' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-[#22c55e] text-xs font-extrabold shrink-0 mt-0.5">✓</div>
                    <div>
                      <strong className="text-sm font-black text-black block">{item.title}</strong>
                      <span className="text-xs text-black/80 font-medium block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
