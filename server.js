const express = require("express")
const cors = require("cors")
const axios = require("axios")
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: [
      "https://cinebook-frontend.onrender.com", // Replace with your frontend Render URL
      "http://localhost:3000", // For local development
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())

// OMDB API Configuration
const OMDB_API_KEY = "6fa6d3a1" // Get free key from http://www.omdbapi.com/apikey.aspx
const OMDB_BASE_URL = "http://www.omdbapi.com/"

// In-memory data storage
const otpStore = {} // { mobile: { otp, timestamp } }
const bookings = []
const movieCache = {} // Cache movies to reduce API calls

// All Major Indian Cities (100+ cities)
const cities = [
  // Tier 1 Cities
  { id: 1, name: "Mumbai", state: "Maharashtra", theaters: 45 },
  { id: 2, name: "Delhi", state: "Delhi", theaters: 40 },
  { id: 3, name: "Bangalore", state: "Karnataka", theaters: 50 },
  { id: 4, name: "Hyderabad", state: "Telangana", theaters: 38 },
  { id: 5, name: "Chennai", state: "Tamil Nadu", theaters: 35 },
  { id: 6, name: "Kolkata", state: "West Bengal", theaters: 32 },
  { id: 7, name: "Pune", state: "Maharashtra", theaters: 30 },
  { id: 8, name: "Ahmedabad", state: "Gujarat", theaters: 28 },

  // Tier 2 Cities
  { id: 9, name: "Surat", state: "Gujarat", theaters: 18 },
  { id: 10, name: "Jaipur", state: "Rajasthan", theaters: 20 },
  { id: 11, name: "Lucknow", state: "Uttar Pradesh", theaters: 16 },
  { id: 12, name: "Kanpur", state: "Uttar Pradesh", theaters: 14 },
  { id: 13, name: "Nagpur", state: "Maharashtra", theaters: 15 },
  { id: 14, name: "Indore", state: "Madhya Pradesh", theaters: 17 },
  { id: 15, name: "Thane", state: "Maharashtra", theaters: 16 },
  { id: 16, name: "Bhopal", state: "Madhya Pradesh", theaters: 13 },
  { id: 17, name: "Visakhapatnam", state: "Andhra Pradesh", theaters: 14 },
  { id: 18, name: "Pimpri-Chinchwad", state: "Maharashtra", theaters: 12 },
  { id: 19, name: "Patna", state: "Bihar", theaters: 11 },
  { id: 20, name: "Vadodara", state: "Gujarat", theaters: 13 },
  { id: 21, name: "Ghaziabad", state: "Uttar Pradesh", theaters: 14 },
  { id: 22, name: "Ludhiana", state: "Punjab", theaters: 12 },
  { id: 23, name: "Agra", state: "Uttar Pradesh", theaters: 10 },
  { id: 24, name: "Nashik", state: "Maharashtra", theaters: 11 },
  { id: 25, name: "Faridabad", state: "Haryana", theaters: 12 },
  { id: 26, name: "Meerut", state: "Uttar Pradesh", theaters: 9 },
  { id: 27, name: "Rajkot", state: "Gujarat", theaters: 11 },
  { id: 28, name: "Kalyan-Dombivali", state: "Maharashtra", theaters: 10 },
  { id: 29, name: "Vasai-Virar", state: "Maharashtra", theaters: 9 },
  { id: 30, name: "Varanasi", state: "Uttar Pradesh", theaters: 8 },

  // Additional Major Cities
  { id: 31, name: "Srinagar", state: "Jammu and Kashmir", theaters: 7 },
  { id: 32, name: "Aurangabad", state: "Maharashtra", theaters: 9 },
  { id: 33, name: "Dhanbad", state: "Jharkhand", theaters: 7 },
  { id: 34, name: "Amritsar", state: "Punjab", theaters: 10 },
  { id: 35, name: "Navi Mumbai", state: "Maharashtra", theaters: 15 },
  { id: 36, name: "Allahabad", state: "Uttar Pradesh", theaters: 8 },
  { id: 37, name: "Ranchi", state: "Jharkhand", theaters: 9 },
  { id: 38, name: "Howrah", state: "West Bengal", theaters: 8 },
  { id: 39, name: "Coimbatore", state: "Tamil Nadu", theaters: 12 },
  { id: 40, name: "Jabalpur", state: "Madhya Pradesh", theaters: 7 },
  { id: 41, name: "Gwalior", state: "Madhya Pradesh", theaters: 8 },
  { id: 42, name: "Vijayawada", state: "Andhra Pradesh", theaters: 11 },
  { id: 43, name: "Jodhpur", state: "Rajasthan", theaters: 8 },
  { id: 44, name: "Madurai", state: "Tamil Nadu", theaters: 10 },
  { id: 45, name: "Raipur", state: "Chhattisgarh", theaters: 9 },
  { id: 46, name: "Kota", state: "Rajasthan", theaters: 7 },
  { id: 47, name: "Chandigarh", state: "Chandigarh", theaters: 12 },
  { id: 48, name: "Guwahati", state: "Assam", theaters: 8 },
  { id: 49, name: "Solapur", state: "Maharashtra", theaters: 6 },
  { id: 50, name: "Hubli-Dharwad", state: "Karnataka", theaters: 8 },
  { id: 51, name: "Mysore", state: "Karnataka", theaters: 9 },
  { id: 52, name: "Tiruchirappalli", state: "Tamil Nadu", theaters: 8 },
  { id: 53, name: "Bareilly", state: "Uttar Pradesh", theaters: 6 },
  { id: 54, name: "Aligarh", state: "Uttar Pradesh", theaters: 5 },
  { id: 55, name: "Tiruppur", state: "Tamil Nadu", theaters: 7 },
  { id: 56, name: "Moradabad", state: "Uttar Pradesh", theaters: 5 },
  { id: 57, name: "Jalandhar", state: "Punjab", theaters: 8 },
  { id: 58, name: "Bhubaneswar", state: "Odisha", theaters: 10 },
  { id: 59, name: "Salem", state: "Tamil Nadu", theaters: 7 },
  { id: 60, name: "Warangal", state: "Telangana", theaters: 6 },
  { id: 61, name: "Guntur", state: "Andhra Pradesh", theaters: 8 },
  { id: 62, name: "Bhiwandi", state: "Maharashtra", theaters: 5 },
  { id: 63, name: "Saharanpur", state: "Uttar Pradesh", theaters: 4 },
  { id: 64, name: "Gorakhpur", state: "Uttar Pradesh", theaters: 6 },
  { id: 65, name: "Bikaner", state: "Rajasthan", theaters: 5 },
  { id: 66, name: "Amravati", state: "Maharashtra", theaters: 6 },
  { id: 67, name: "Noida", state: "Uttar Pradesh", theaters: 15 },
  { id: 68, name: "Jamshedpur", state: "Jharkhand", theaters: 7 },
  { id: 69, name: "Bhilai", state: "Chhattisgarh", theaters: 5 },
  { id: 70, name: "Cuttack", state: "Odisha", theaters: 6 },
  { id: 71, name: "Firozabad", state: "Uttar Pradesh", theaters: 4 },
  { id: 72, name: "Kochi", state: "Kerala", theaters: 12 },
  { id: 73, name: "Nellore", state: "Andhra Pradesh", theaters: 5 },
  { id: 74, name: "Bhavnagar", state: "Gujarat", theaters: 6 },
  { id: 75, name: "Dehradun", state: "Uttarakhand", theaters: 8 },
  { id: 76, name: "Durgapur", state: "West Bengal", theaters: 5 },
  { id: 77, name: "Asansol", state: "West Bengal", theaters: 6 },
  { id: 78, name: "Rourkela", state: "Odisha", theaters: 4 },
  { id: 79, name: "Nanded", state: "Maharashtra", theaters: 5 },
  { id: 80, name: "Kolhapur", state: "Maharashtra", theaters: 6 },
  { id: 81, name: "Ajmer", state: "Rajasthan", theaters: 5 },
  { id: 82, name: "Akola", state: "Maharashtra", theaters: 4 },
  { id: 83, name: "Gulbarga", state: "Karnataka", theaters: 5 },
  { id: 84, name: "Jamnagar", state: "Gujarat", theaters: 6 },
  { id: 85, name: "Ujjain", state: "Madhya Pradesh", theaters: 5 },
  { id: 86, name: "Loni", state: "Uttar Pradesh", theaters: 3 },
  { id: 87, name: "Siliguri", state: "West Bengal", theaters: 7 },
  { id: 88, name: "Jhansi", state: "Uttar Pradesh", theaters: 5 },
  { id: 89, name: "Ulhasnagar", state: "Maharashtra", theaters: 4 },
  { id: 90, name: "Jammu", state: "Jammu and Kashmir", theaters: 6 },
  { id: 91, name: "Mangalore", state: "Karnataka", theaters: 8 },
  { id: 92, name: "Erode", state: "Tamil Nadu", theaters: 6 },
  { id: 93, name: "Belgaum", state: "Karnataka", theaters: 6 },
  { id: 94, name: "Ambattur", state: "Tamil Nadu", theaters: 5 },
  { id: 95, name: "Tirunelveli", state: "Tamil Nadu", theaters: 6 },
  { id: 96, name: "Malegaon", state: "Maharashtra", theaters: 3 },
  { id: 97, name: "Gaya", state: "Bihar", theaters: 4 },
  { id: 98, name: "Thiruvananthapuram", state: "Kerala", theaters: 9 },
  { id: 99, name: "Udaipur", state: "Rajasthan", theaters: 7 },
  { id: 100, name: "Maheshtala", state: "West Bengal", theaters: 3 },
]

// Popular Indian movies to search (OMDB has limited Indian content, so we'll search these)
const indianMovieTitles = [
  "Pushpa",
  "RRR",
  "KGF",
  "Baahubali",
  "Jawan",
  "Pathaan",
  "Dangal",
  "PK",
  "Bajrangi Bhaijaan",
  "Sultan",
  "Tiger Zinda Hai",
  "War",
  "Sanju",
  "Padmaavat",
  "3 Idiots",
  "Dhoom",
  "Chennai Express",
  "Happy New Year",
  "Kick",
  "Bang Bang",
  "Ek Tha Tiger",
  "Yeh Jawaani Hai Deewani",
]

// Region mapping for cities
const getCityRegion = (cityId) => {
  const regionMap = {
    South: [4, 5, 17, 39, 42, 44, 50, 51, 52, 55, 59, 60, 61, 72, 73, 83, 91, 92, 93, 94, 95, 98],
    North: [
      2, 10, 11, 12, 21, 22, 23, 25, 26, 30, 34, 36, 43, 46, 47, 53, 54, 56, 57, 63, 64, 65, 67, 75, 81, 85, 86, 88, 90,
      99,
    ],
    West: [1, 7, 8, 9, 13, 15, 18, 20, 24, 27, 28, 29, 32, 35, 49, 62, 66, 74, 79, 80, 82, 84, 89, 96],
    East: [6, 16, 19, 31, 33, 37, 38, 40, 41, 45, 48, 58, 68, 69, 70, 76, 77, 78, 87, 97, 100],
  }

  for (const [region, cityIds] of Object.entries(regionMap)) {
    if (cityIds.includes(Number.parseInt(cityId))) {
      return region
    }
  }
  return "North"
}

// Fetch movie from OMDB API
const fetchMovieFromOMDB = async (title) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        t: title,
        type: "movie",
      },
    })

    if (response.data.Response === "True") {
      return {
        id: response.data.imdbID,
        title: response.data.Title,
        genre: response.data.Genre,
        rating: response.data.imdbRating,
        duration: response.data.Runtime,
        releaseDate: response.data.Released,
        poster:
          response.data.Poster !== "N/A"
            ? response.data.Poster
            : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        language: response.data.Language,
        plot: response.data.Plot,
        year: response.data.Year,
      }
    }
    return null
  } catch (error) {
    console.error(`Error fetching movie ${title}:`, error.message)
    return null
  }
}

// Get recent movies from OMDB
const getRecentMoviesFromOMDB = async (cityId) => {
  const cacheKey = `city_${cityId}`
  const cacheTime = 3600000 // 1 hour cache

  // Check cache
  if (movieCache[cacheKey] && Date.now() - movieCache[cacheKey].timestamp < cacheTime) {
    console.log(`✅ Returning cached movies for city ${cityId}`)
    return movieCache[cacheKey].movies
  }

  console.log(`🔍 Fetching movies from OMDB for city ${cityId}...`)

  const movies = []
  const currentYear = new Date().getFullYear()

  // Fetch random selection of Indian movies
  const moviesToFetch = indianMovieTitles.sort(() => 0.5 - Math.random()).slice(0, 8)

  for (const title of moviesToFetch) {
    const movie = await fetchMovieFromOMDB(title)
    if (movie) {
      movies.push(movie)
    }
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  // Cache the results
  movieCache[cacheKey] = {
    movies,
    timestamp: Date.now(),
  }

  console.log(`✅ Fetched ${movies.length} movies from OMDB`)
  return movies
}

// Theaters data
const theaters = {
  1: [
    {
      id: 1001,
      name: "PVR Phoenix Mumbai",
      showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
      ticketPrice: 350,
    },
    {
      id: 1002,
      name: "Inox Nariman Point",
      showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
      ticketPrice: 380,
    },
    { id: 1003, name: "Cinepolis Andheri", showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"], ticketPrice: 320 },
  ],
  3: [
    { id: 3001, name: "PVR Forum Mall", showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"], ticketPrice: 300 },
    { id: 3002, name: "Inox Garuda Mall", showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"], ticketPrice: 280 },
    {
      id: 3003,
      name: "Cinepolis Royal Meenakshi",
      showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
      ticketPrice: 250,
    },
  ],
  4: [
    { id: 4001, name: "AMB Cinemas", showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"], ticketPrice: 280 },
    {
      id: 4002,
      name: "PVR Forum Sujana Mall",
      showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
      ticketPrice: 300,
    },
    { id: 4003, name: "Inox GVK One", showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"], ticketPrice: 270 },
  ],
}

// Generate random OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Send OTP via SMS
const sendOTPviaSMS = (mobile, otp) => {
  console.log(`\n📱 ========== OTP NOTIFICATION ==========`)
  console.log(`📞 Mobile: +91${mobile}`)
  console.log(`🔐 OTP: ${otp}`)
  console.log(`⏰ Valid for: 5 minutes`)
  console.log(`=========================================\n`)

  return { success: true, message: "OTP sent to mobile number" }
}

// Routes

// 1. Send OTP
app.post("/api/send-otp", (req, res) => {
  const { mobile } = req.body

  if (!mobile || mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ message: "Invalid mobile number" })
  }

  const otp = generateOTP()
  const timestamp = new Date()

  otpStore[mobile] = { otp, timestamp }

  const smsResult = sendOTPviaSMS(mobile, otp)

  if (smsResult.success) {
    res.json({
      success: true,
      message: "OTP sent to your mobile number",
      otp: otp, // FOR DEMO ONLY
    })
  } else {
    res.status(500).json({
      message: "Failed to send OTP. Please try again.",
    })
  }
})

// 2. Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { mobile, otp } = req.body

  if (!mobile || !otp) {
    return res.status(400).json({ message: "Mobile number and OTP are required" })
  }

  const storedData = otpStore[mobile]

  if (!storedData) {
    return res.status(401).json({ message: "OTP expired or not found. Please request a new OTP." })
  }

  const now = new Date()
  const otpAge = (now - storedData.timestamp) / 1000 / 60

  if (otpAge > 5) {
    delete otpStore[mobile]
    return res.status(401).json({ message: "OTP expired. Please request a new OTP." })
  }

  if (storedData.otp === otp) {
    delete otpStore[mobile]
    return res.json({
      success: true,
      message: "OTP verified successfully",
    })
  } else {
    return res.status(401).json({
      message: "Invalid OTP. Please try again.",
    })
  }
})

// 3. Get All Cities (with search support)
app.get("/api/cities", (req, res) => {
  const { search } = req.query

  if (search) {
    const searchTerm = search.toLowerCase().trim()
    const filteredCities = cities.filter(
      (city) => city.name.toLowerCase().includes(searchTerm) || city.state.toLowerCase().includes(searchTerm),
    )
    console.log(`🔍 Search "${search}": Found ${filteredCities.length} cities`)
    return res.json(filteredCities)
  }

  res.json(cities)
})

// 4. Get Movies from OMDB API
app.get("/api/movies/:cityId", async (req, res) => {
  const { cityId } = req.params

  try {
    const movies = await getRecentMoviesFromOMDB(cityId)

    if (movies.length === 0) {
      return res.status(404).json({
        message: "No movies found. Please check OMDB API key.",
      })
    }

    res.json(movies)
  } catch (error) {
    console.error("Error fetching movies:", error)
    res.status(500).json({
      message: "Error fetching movies from OMDB API",
    })
  }
})

// 5. Get Theaters
app.get("/api/theaters/:cityId/:movieId", (req, res) => {
  const { cityId } = req.params

  const cityTheaters = theaters[cityId] || [
    {
      id: Number.parseInt(cityId) * 100 + 1,
      name: `PVR Cinemas`,
      showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
      ticketPrice: 200,
    },
    {
      id: Number.parseInt(cityId) * 100 + 2,
      name: `Inox Multiplex`,
      showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
      ticketPrice: 220,
    },
    {
      id: Number.parseInt(cityId) * 100 + 3,
      name: `Cinepolis`,
      showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
      ticketPrice: 180,
    },
  ]

  res.json(cityTheaters)
})

// 6. Get Booked Seats
app.get("/api/booked-seats/:theaterId/:showtime", (req, res) => {
  const { theaterId, showtime } = req.params

  const theaterBookings = bookings.filter((b) => b.theaterId == theaterId && b.showtime === showtime)

  const bookedSeats = theaterBookings.reduce((acc, booking) => {
    return [...acc, ...booking.seats]
  }, [])

  res.json({ bookedSeats })
})

// 7. Book Tickets
app.post("/api/book-tickets", (req, res) => {
  const { mobile, cityId, movieId, theaterId, showtime, seats, totalAmount } = req.body

  if (!mobile || !cityId || !movieId || !theaterId || !showtime || !seats || seats.length === 0) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const existingBookings = bookings.filter((b) => b.theaterId == theaterId && b.showtime === showtime)

  const alreadyBookedSeats = existingBookings.reduce((acc, booking) => {
    return [...acc, ...booking.seats]
  }, [])

  const conflictSeats = seats.filter((seat) => alreadyBookedSeats.includes(seat))

  if (conflictSeats.length > 0) {
    return res.status(409).json({
      message: `Seats ${conflictSeats.join(", ")} are already booked`,
    })
  }

  const booking = {
    id: bookings.length + 1,
    mobile,
    cityId,
    movieId,
    theaterId,
    showtime,
    seats,
    totalAmount,
    bookingDate: new Date().toISOString(),
  }

  bookings.push(booking)

  console.log("✅ Booking created:", booking)

  console.log(`\n📧 ========== BOOKING CONFIRMATION ==========`)
  console.log(`📞 Mobile: +91${mobile}`)
  console.log(`🎬 Booking ID: ${booking.id}`)
  console.log(`💺 Seats: ${seats.join(", ")}`)
  console.log(`💰 Amount: ₹${totalAmount}`)
  console.log(`===========================================\n`)

  res.json({
    success: true,
    message: "Tickets booked successfully",
    booking,
  })
})

// 8. Get User Bookings
app.get("/api/bookings/:mobile", (req, res) => {
  const { mobile } = req.params
  const userBookings = bookings.filter((b) => b.mobile === mobile)
  res.json(userBookings)
})

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ ========== CineBook Backend Server ==========`)
  console.log(`🚀 Server running on: http://localhost:${PORT}`)
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`)
  console.log(`🏙️  Total Cities: ${cities.length} Indian cities`)
  console.log(`🔍 City Search: /api/cities?search=query`)
  console.log(`🎬 Movie Source: OMDB API`)
  console.log(`📱 OTP System: Active`)
  console.log(`⚠️  IMPORTANT: Set your OMDB_API_KEY in the code!`)
  console.log(`   Get free key: http://www.omdbapi.com/apikey.aspx`)
  console.log(`===============================================\n`)
})
