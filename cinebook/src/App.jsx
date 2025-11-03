"use client"

import { useState } from "react"

const CineBook = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedTheater, setSelectedTheater] = useState(null)
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [userMobile, setUserMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtpSection, setShowOtpSection] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  const [cities, setCities] = useState([])
  const [movies, setMovies] = useState([])
  const [theaters, setTheaters] = useState([])
  const [bookedSeats, setBookedSeats] = useState([])
  const [loading, setLoading] = useState(false)
  const [citySearchTerm, setCitySearchTerm] = useState("")
  const [apiError, setApiError] = useState("")

  const API_URL = "https://msd-project-pmwx.onrender.com"

  const fetchCities = async (search = "") => {
    setLoading(true)
    setApiError("")
    try {
      const url = search ? `${API_URL}/cities?search=${encodeURIComponent(search)}` : `${API_URL}/cities`
      console.log("[v0] Fetching cities from:", url)
      const response = await fetch(url)
      console.log("[v0] Cities response status:", response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Cities fetched:", data.length, "cities")
      setCities(data)
      setApiError("")
    } catch (error) {
      console.error("[v0] Error fetching cities:", error)
      setApiError(
        `Failed to load cities: ${error.message}. Make sure the backend server is running on http://localhost:5000`,
      )
      setCities([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMovies = async (cityId) => {
    setLoading(true)
    setApiError("")
    try {
      const url = `${API_URL}/movies/${cityId}`
      console.log("[v0] Fetching movies from:", url)
      const response = await fetch(url)
      console.log("[v0] Movies response status:", response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Movies fetched:", data.length, "movies")
      setMovies(data)
      setApiError("")
    } catch (error) {
      console.error("[v0] Error fetching movies:", error)
      setApiError(`Failed to load movies: ${error.message}`)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTheaters = async (cityId, movieId) => {
    setLoading(true)
    setApiError("")
    try {
      const url = `${API_URL}/theaters/${cityId}/${movieId}`
      console.log("[v0] Fetching theaters from:", url)
      const response = await fetch(url)
      console.log("[v0] Theaters response status:", response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Theaters fetched:", data.length, "theaters")
      setTheaters(data)
      setApiError("")
    } catch (error) {
      console.error("[v0] Error fetching theaters:", error)
      setApiError(`Failed to load theaters: ${error.message}`)
      setTheaters([])
    } finally {
      setLoading(false)
    }
  }

  const fetchBookedSeats = async (theaterId, showtime) => {
    setLoading(true)
    setApiError("")
    try {
      const url = `${API_URL}/booked-seats/${theaterId}/${showtime}`
      console.log("[v0] Fetching booked seats from:", url)
      const response = await fetch(url)
      console.log("[v0] Booked seats response status:", response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Booked seats fetched:", data.bookedSeats?.length || 0, "seats")
      setBookedSeats(data.bookedSeats || [])
      setApiError("")
    } catch (error) {
      console.error("[v0] Error fetching booked seats:", error)
      setApiError(`Failed to load seat information: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ec1e40 0%, #764ba2 100%)",
      fontFamily: "Arial, sans-serif",
    },
    mainContainer: {
      width: "100%",
      margin: "0",
      padding: "20px",
      boxSizing: "border-box",
    },
    header: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "20px",
      borderRadius: "15px",
      marginBottom: "30px",
      textAlign: "center",
      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
    },
    headerTitle: {
      color: "#a0dd10",
      fontSize: "2.5em",
      marginBottom: "10px",
      textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
      margin: "0 0 10px 0",
    },
    step: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
      marginBottom: "20px",
    },
    stepIndicator: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
    },
    stepItem: {
      display: "flex",
      alignItems: "center",
      margin: "0 10px",
    },
    stepNumber: {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      background: "#ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "10px",
      fontWeight: "bold",
      color: "#333",
    },
    stepNumberActive: {
      background: "#667eea",
      color: "white",
    },
    stepNumberCompleted: {
      background: "#4CAF50",
      color: "white",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "2px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    searchContainer: {
      position: "relative",
      marginBottom: "20px",
    },
    searchIcon: {
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#999",
      fontSize: "18px",
    },
    searchInput: {
      width: "100%",
      padding: "15px 15px 15px 45px",
      border: "2px solid #667eea",
      borderRadius: "12px",
      fontSize: "16px",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      background: "white",
    },
    searchResultsInfo: {
      color: "#666",
      fontSize: "14px",
      marginTop: "10px",
      fontStyle: "italic",
    },
    button: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      padding: "12px 30px",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
      marginRight: "10px",
    },
    buttonDisabled: {
      background: "#ccc",
      cursor: "not-allowed",
      boxShadow: "none",
    },
    buttonBack: {
      background: "#6c757d",
    },
    citiesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginTop: "20px",
      maxHeight: "500px",
      overflowY: "auto",
      paddingRight: "10px",
    },
    cityCard: {
      background: "white",
      padding: "30px",
      borderRadius: "15px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      border: "2px solid transparent",
    },
    cityCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
      borderColor: "#667eea",
    },
    cityCardSelected: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      transform: "scale(1.05)",
    },
    cityName: {
      fontSize: "1.2em",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    cityState: {
      fontSize: "0.85em",
      color: "#666",
      marginTop: "5px",
    },
    cityTheaters: {
      marginTop: "8px",
      fontSize: "0.9em",
      fontWeight: "500",
    },
    noResults: {
      textAlign: "center",
      padding: "40px",
      color: "#666",
    },
    moviesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    movieCard: {
      background: "white",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    moviePoster: {
      width: "100%",
      height: "350px",
      objectFit: "cover",
      background: "linear-gradient(45deg, #667eea, #764ba2)",
    },
    movieInfo: {
      padding: "20px",
    },
    movieTitle: {
      fontSize: "1.3em",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#333",
    },
    movieGenre: {
      color: "#666",
      marginBottom: "10px",
      fontSize: "0.9em",
    },
    movieRating: {
      background: "#667eea",
      color: "white",
      padding: "5px 10px",
      borderRadius: "15px",
      display: "inline-block",
      fontSize: "0.9em",
      marginRight: "10px",
    },
    movieReleaseDate: {
      color: "#999",
      fontSize: "0.85em",
      marginTop: "5px",
    },
    theatersList: {
      marginTop: "20px",
    },
    theaterCard: {
      background: "white",
      padding: "20px",
      marginBottom: "15px",
      borderRadius: "15px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    theaterCardSelected: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
    },
    showtimeSlots: {
      marginTop: "15px",
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    },
    timeSlot: {
      background: "#f0f0f0",
      padding: "10px 20px",
      borderRadius: "20px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "2px solid transparent",
    },
    timeSlotSelected: {
      background: "#667eea",
      color: "white",
      borderColor: "#5a67d8",
    },
    timeSlotDisabled: {
      background: "#e0e0e0",
      color: "#999",
      cursor: "not-allowed",
      textDecoration: "line-through",
    },
    seatMap: {
      maxWidth: "700px",
      margin: "0 auto",
      padding: "20px",
    },
    screen: {
      background: "#333",
      color: "white",
      textAlign: "center",
      padding: "15px",
      marginBottom: "30px",
      borderRadius: "50px",
      fontWeight: "bold",
    },
    seatsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(10, 1fr)",
      gap: "10px",
      marginBottom: "20px",
    },
    seat: {
      width: "45px",
      height: "45px",
      border: "2px solid #ccc",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "11px",
      transition: "all 0.3s ease",
    },
    seatAvailable: {
      background: "#4CAF50",
      color: "white",
      borderColor: "#45a049",
    },
    seatSelected: {
      background: "#667eea",
      color: "white",
      borderColor: "#5a67d8",
    },
    seatBooked: {
      background: "#f44336",
      color: "white",
      borderColor: "#da190b",
      cursor: "not-allowed",
    },
    seatLegend: {
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      margin: "20px 0",
      flexWrap: "wrap",
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    legendColor: {
      width: "20px",
      height: "20px",
      borderRadius: "4px",
    },
    bookingSummary: {
      background: "#f9f9f9",
      padding: "20px",
      borderRadius: "15px",
      marginTop: "20px",
    },
    error: {
      color: "#f44336",
      fontSize: "14px",
      marginTop: "5px",
    },
    success: {
      color: "#4CAF50",
      fontSize: "14px",
      marginTop: "5px",
    },
    errorAlert: {
      background: "#ffebee",
      border: "2px solid #f44336",
      color: "#c62828",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "14px",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "white",
      borderRadius: "15px",
      padding: "30px",
      maxWidth: "400px",
      margin: "20px",
      textAlign: "center",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    },
    modalEmoji: {
      fontSize: "60px",
      marginBottom: "20px",
    },
    modalTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#4CAF50",
      marginBottom: "20px",
    },
    modalDetails: {
      color: "#666",
      marginBottom: "20px",
      lineHeight: "1.5",
    },
  }

  const sendOTP = async () => {
    if (!userMobile || userMobile.length !== 10 || !/^\d{10}$/.test(userMobile)) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number" })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: userMobile }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowOtpSection(true)
        alert(`OTP sent successfully! Use: ${data.otp}`)
      } else {
        setErrors({ mobile: data.message || "Failed to send OTP" })
      }
    } catch (error) {
      setErrors({ mobile: "Server error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      setErrors({ otp: "Please enter a valid 4-digit OTP" })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: userMobile, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        setCurrentStep(2)
        fetchCities()
      } else {
        setErrors({ otp: data.message || "Invalid OTP. Please try again." })
      }
    } catch (error) {
      setErrors({ otp: "Server error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleCitySearch = (e) => {
    const value = e.target.value
    setCitySearchTerm(value)
    fetchCities(value)
  }

  const selectCity = (city) => {
    setSelectedCity(city)
    fetchMovies(city.id)
    setCitySearchTerm("")
    setCurrentStep(3)
  }

  const selectMovie = (movie) => {
    setSelectedMovie(movie)
    fetchTheaters(selectedCity.id, movie.id)
    setCurrentStep(4)
  }

  const selectTheater = (theater) => {
    setSelectedTheater(theater)
    setSelectedShowtime(null)
    setSelectedSeats([])
  }

  const selectShowtime = (showtime) => {
    setSelectedShowtime(showtime)
    fetchBookedSeats(selectedTheater.id, showtime)
    setCurrentStep(5)
  }

  const isShowtimePassed = (showtime) => {
    const now = new Date()
    const [time, period] = showtime.split(" ")
    let [hours, minutes] = time.split(":").map(Number)

    if (period === "PM" && hours !== 12) hours += 12
    if (period === "AM" && hours === 12) hours = 0

    const showtimeDate = new Date()
    showtimeDate.setHours(hours, minutes, 0, 0)

    return now > showtimeDate
  }

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId))
    } else {
      if (selectedSeats.length >= 10) {
        alert("You can select maximum 10 seats")
        return
      }
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  const getSeatClass = (seatId) => {
    if (bookedSeats.includes(seatId)) return "booked"
    if (selectedSeats.includes(seatId)) return "selected"
    return "available"
  }

  const bookTickets = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/book-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: userMobile,
          cityId: selectedCity.id,
          movieId: selectedMovie.id,
          theaterId: selectedTheater.id,
          showtime: selectedShowtime,
          seats: selectedSeats,
          totalAmount: selectedSeats.length * selectedTheater.ticketPrice,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowSuccessNotification(true)
        setTimeout(() => {
          setShowSuccessNotification(false)
          resetBooking()
        }, 4000)
      } else {
        alert(data.message || "Booking failed")
      }
    } catch (error) {
      alert("Server error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetBooking = () => {
    setCurrentStep(1)
    setSelectedCity(null)
    setSelectedMovie(null)
    setSelectedTheater(null)
    setSelectedShowtime(null)
    setSelectedSeats([])
    setUserMobile("")
    setOtp("")
    setShowOtpSection(false)
    setErrors({})
    setCities([])
    setMovies([])
    setTheaters([])
    setBookedSeats([])
    setCitySearchTerm("")
    setApiError("")
  }

  const previousStep = () => {
    if (currentStep === 5) {
      setSelectedShowtime(null)
      setSelectedSeats([])
      setCurrentStep(4)
    } else if (currentStep === 2) {
      setCitySearchTerm("")
      setCurrentStep(currentStep - 1)
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const StepIndicator = () => (
    <div style={styles.stepIndicator}>
      {["Login", "City", "Movie", "Theater", "Seats"].map((step, index) => (
        <div key={index} style={styles.stepItem}>
          <div
            style={{
              ...styles.stepNumber,
              ...(index + 1 < currentStep
                ? styles.stepNumberCompleted
                : index + 1 === currentStep
                  ? styles.stepNumberActive
                  : {}),
            }}
          >
            {index + 1}
          </div>
          <span>{step}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div style={styles.container}>
      {showSuccessNotification && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalEmoji}>🎉</div>
            <h2 style={styles.modalTitle}>Booking Confirmed!</h2>
            <div style={styles.modalDetails}>
              <p>
                <strong>Movie:</strong> {selectedMovie?.title}
              </p>
              <p>
                <strong>Theater:</strong> {selectedTheater?.name}
              </p>
              <p>
                <strong>Showtime:</strong> {selectedShowtime}
              </p>
              <p>
                <strong>Seats:</strong> {selectedSeats.join(", ")}
              </p>
              <p>
                <strong>Total:</strong> ₹{selectedSeats.length * (selectedTheater?.ticketPrice || 0)}
              </p>
            </div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#667eea" }}>Enjoy your movie! 🍿</div>
          </div>
        </div>
      )}

      <div style={styles.mainContainer}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>🎬 CineBook</h1>
          <p>Your Ultimate Movie Booking Experience</p>
        </div>

        <StepIndicator />

        {currentStep === 1 && (
          <div style={styles.step}>
            <h2 style={{ marginBottom: "20px" }}>🔐 Login with Mobile Number</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mobile Number</label>
              <input
                type="tel"
                value={userMobile}
                onChange={(e) => setUserMobile(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                style={styles.input}
              />
              {errors.mobile && <div style={styles.error}>{errors.mobile}</div>}
            </div>
            <button
              onClick={sendOTP}
              disabled={loading}
              style={{ ...styles.button, ...(loading && styles.buttonDisabled) }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            {showOtpSection && (
              <div style={{ marginTop: "20px" }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    maxLength="4"
                    style={styles.input}
                  />
                  <div style={styles.success}>OTP sent to your mobile number</div>
                  {errors.otp && <div style={styles.error}>{errors.otp}</div>}
                </div>
                <button
                  onClick={verifyOTP}
                  disabled={loading}
                  style={{ ...styles.button, ...(loading && styles.buttonDisabled) }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div style={styles.step}>
            <h2 style={{ marginBottom: "20px" }}>🏙️ Select Your City</h2>

            {apiError && <div style={styles.errorAlert}>⚠️ {apiError}</div>}

            {/* City Search Bar */}
            <div style={styles.searchContainer}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                value={citySearchTerm}
                onChange={handleCitySearch}
                placeholder="Search for your city (e.g., Mumbai, Chennai, Delhi)..."
                style={styles.searchInput}
              />
            </div>

            {citySearchTerm && (
              <div style={styles.searchResultsInfo}>
                Found {cities.length} {cities.length === 1 ? "city" : "cities"}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>Loading cities...</p>
              </div>
            ) : cities.length > 0 ? (
              <div style={styles.citiesGrid}>
                {cities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => selectCity(city)}
                    style={{
                      ...styles.cityCard,
                      ...(selectedCity?.id === city.id ? styles.cityCardSelected : {}),
                    }}
                  >
                    <h3 style={{ fontSize: "1.5em", marginBottom: "10px" }}>📍</h3>
                    <div style={styles.cityName}>{city.name}</div>
                    <div style={styles.cityState}>{city.state}</div>
                    <div style={styles.cityTheaters}>🎬 {city.theaters} theaters</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noResults}>
                <p style={{ fontSize: "18px", marginBottom: "10px" }}>No cities found</p>
                <p style={{ fontSize: "14px", color: "#999" }}>Try searching for a different city</p>
              </div>
            )}

            <button onClick={previousStep} style={{ ...styles.button, ...styles.buttonBack, marginTop: "20px" }}>
              Back
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div style={styles.step}>
            <h2 style={{ marginBottom: "20px" }}>🎭 Now Showing in {selectedCity?.name}</h2>
            {apiError && <div style={styles.errorAlert}>⚠️ {apiError}</div>}
            {loading ? (
              <p>Loading movies...</p>
            ) : (
              <div style={styles.moviesGrid}>
                {movies.map((movie) => (
                  <div key={movie.id} onClick={() => selectMovie(movie)} style={styles.movieCard}>
                    <img src={movie.poster || "/placeholder.svg"} alt={movie.title} style={styles.moviePoster} />
                    <div style={styles.movieInfo}>
                      <div style={styles.movieTitle}>{movie.title}</div>
                      <div style={styles.movieGenre}>{movie.genre}</div>
                      <div>
                        <span style={styles.movieRating}>⭐ {movie.rating}</span>
                        <span style={styles.movieRating}>🕐 {movie.duration}</span>
                      </div>
                      <div style={styles.movieReleaseDate}>
                        {movie.year
                          ? `Year: ${movie.year}`
                          : `Released: ${new Date(movie.releaseDate).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={previousStep} style={{ ...styles.button, ...styles.buttonBack, marginTop: "20px" }}>
              Back
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div style={styles.step}>
            <h2 style={{ marginBottom: "20px" }}>🎪 Select Theater & Showtime</h2>
            {apiError && <div style={styles.errorAlert}>⚠️ {apiError}</div>}
            {loading ? (
              <p>Loading theaters...</p>
            ) : (
              <div style={styles.theatersList}>
                {theaters.map((theater) => (
                  <div
                    key={theater.id}
                    style={{
                      ...styles.theaterCard,
                      ...(selectedTheater?.id === theater.id ? styles.theaterCardSelected : {}),
                    }}
                    onClick={() => selectTheater(theater)}
                  >
                    <h3 style={{ marginBottom: "10px" }}>{theater.name}</h3>
                    <p style={{ marginBottom: "10px" }}>💺 Ticket Price: ₹{theater.ticketPrice}</p>
                    <div style={styles.showtimeSlots}>
                      {theater.showtimes.map((showtime) => {
                        const isPassed = isShowtimePassed(showtime)
                        return (
                          <span
                            key={showtime}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!isPassed) {
                                selectTheater(theater)
                                selectShowtime(showtime)
                              }
                            }}
                            style={{
                              ...styles.timeSlot,
                              ...(isPassed ? styles.timeSlotDisabled : {}),
                              ...(selectedShowtime === showtime && selectedTheater?.id === theater.id
                                ? styles.timeSlotSelected
                                : {}),
                            }}
                          >
                            {showtime}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={previousStep} style={{ ...styles.button, ...styles.buttonBack, marginTop: "20px" }}>
              Back
            </button>
          </div>
        )}

        {currentStep === 5 && (
          <div style={styles.step}>
            <h2 style={{ marginBottom: "20px" }}>💺 Select Your Seats</h2>
            {apiError && <div style={styles.errorAlert}>⚠️ {apiError}</div>}
            <div style={styles.seatMap}>
              <div style={styles.screen}>SCREEN</div>

              <div style={styles.seatsContainer}>
                {Array.from({ length: 80 }, (_, i) => {
                  const row = String.fromCharCode(65 + Math.floor(i / 10))
                  const seatNum = (i % 10) + 1
                  const seatId = `${row}${seatNum}`
                  const seatClass = getSeatClass(seatId)

                  let seatStyle = { ...styles.seat }
                  if (seatClass === "available") seatStyle = { ...seatStyle, ...styles.seatAvailable }
                  else if (seatClass === "selected") seatStyle = { ...seatStyle, ...styles.seatSelected }
                  else if (seatClass === "booked") seatStyle = { ...seatStyle, ...styles.seatBooked }

                  return (
                    <div key={seatId} onClick={() => seatClass !== "booked" && toggleSeat(seatId)} style={seatStyle}>
                      {seatId}
                    </div>
                  )
                })}
              </div>

              <div style={styles.seatLegend}>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendColor, background: "#4CAF50" }}></div>
                  <span>Available</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendColor, background: "#667eea" }}></div>
                  <span>Selected</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendColor, background: "#f44336" }}></div>
                  <span>Booked</span>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div style={styles.bookingSummary}>
                  <h3 style={{ marginBottom: "15px" }}>Booking Summary</h3>
                  <p>
                    <strong>Movie:</strong> {selectedMovie?.title}
                  </p>
                  <p>
                    <strong>Theater:</strong> {selectedTheater?.name}
                  </p>
                  <p>
                    <strong>Showtime:</strong> {selectedShowtime}
                  </p>
                  <p>
                    <strong>Seats:</strong> {selectedSeats.join(", ")}
                  </p>
                  <p>
                    <strong>Tickets:</strong> {selectedSeats.length} x ₹{selectedTheater?.ticketPrice || 0} = ₹
                    {selectedSeats.length * (selectedTheater?.ticketPrice || 0)}
                  </p>
                  <hr style={{ margin: "10px 0" }} />
                  <p>
                    <strong>Total Amount: ₹{selectedSeats.length * (selectedTheater?.ticketPrice || 0)}</strong>
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: "20px" }}>
              <button onClick={previousStep} style={{ ...styles.button, ...styles.buttonBack }}>
                Back
              </button>
              <button
                onClick={bookTickets}
                disabled={selectedSeats.length === 0 || loading}
                style={{
                  ...styles.button,
                  ...(selectedSeats.length === 0 || loading ? styles.buttonDisabled : {}),
                }}
              >
                {loading ? "Booking..." : "Book Tickets"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CineBook
