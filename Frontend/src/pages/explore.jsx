"use client"

import { useState } from "react"
import { Search, RefreshCw, MapPin, Calendar, DollarSign, Users, Clock, Star, Sparkles, Brain, Zap, TrendingUp } from "lucide-react"
import "./explore.css"
import BackButton from "../components/BackButton"

const HomePage = () => {
  const [type, setType] = useState("")
  const [budget, setBudget] = useState("")
  const [time, setTime] = useState("")
  const [tourPackage, setTourPackage] = useState("")
  const [days, setDays] = useState(1)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const getRecommendations = async () => {
    if (!type || !budget || !time || !tourPackage || !days) {
      alert("Please fill out all fields.")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: [type, budget, time, tourPackage, days] }),
      })

      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      alert("An error occurred while fetching recommendations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setType("")
    setBudget("")
    setTime("")
    setTourPackage("")
    setDays(1)
    setRecommendations([])
  }

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = []
    const numStars = Math.round(Number.parseFloat(rating))

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i < numStars ? "#FFD700" : "transparent"}
          stroke={i < numStars ? "#FFD700" : "#ccc"}
        />,
      )
    }

    return stars
  }

  return (
    <div className="container">
      <BackButton />

      {/* ── AI Hero Header ── */}
      <div className="explore-hero">
        <div className="explore-ai-badge">
          <span className="explore-ai-badge__dot" />
          AI-Powered Recommendations
        </div>
        <h1>Find Your Perfect Trip</h1>
        <p className="explore-subtitle">
          Tell us your travel preferences and our AI engine will surface the best-matched
          destinations from thousands of options — instantly.
        </p>
        <div className="explore-features">
          <span className="explore-feature-pill"><Brain size={13} /> Smart Matching</span>
          <span className="explore-feature-pill"><Zap size={13} /> Instant Results</span>
          <span className="explore-feature-pill"><TrendingUp size={13} /> Personalised</span>
          <span className="explore-feature-pill"><Sparkles size={13} /> Curated Picks</span>
        </div>
      </div>

      {/* ── Preference Form ── */}
      <div className="form-container">
        <div className="form-section-label">Your Travel Preferences</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Type of Place</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., beach, mountain, historical"
              required
            />
          </div>

          <div className="form-group">
            <label>Budget</label>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} required>
              <option value="">Select Budget</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Best Time to Visit</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g., summer, winter, monsoon"
              required
            />
          </div>

          <div className="form-group">
            <label>Tour Package Type</label>
            <select value={tourPackage} onChange={(e) => setTourPackage(e.target.value)} required>
              <option value="">Select Package</option>
              <option value="Family">Family</option>
              <option value="Solo">Solo</option>
              <option value="Friends">Friends</option>
              <option value="Couple">Couple</option>
            </select>
          </div>

          <div className="form-group">
            <label>No. of Days</label>
            <input type="number" value={days} onChange={(e) => setDays(e.target.value)} min="1" required placeholder="e.g., 5" />
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={getRecommendations}>
            <Search size={16} />
            Get AI Recommendations
          </button>
          <button className="btn btn-secondary" onClick={resetForm}>
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="results-container">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div id="results">
            {recommendations.length > 0 && <h2>Recommended Places</h2>}

            {recommendations.length > 0 ? (
              recommendations.map((place, index) => (
                <div key={index} className="result-item">
                  <div className="place-name">{place["Place Name"]}</div>

                  <div className="place-details">
                    <div className="detail-badge">
                      <MapPin size={14} />
                      {place["Type of Tourist Place"]}
                    </div>

                    <div className="detail-badge">
                      <DollarSign size={14} />
                      {place["Budget"]} Budget
                    </div>

                    <div className="detail-badge">
                      <Calendar size={14} />
                      {place["Best Time to Visit"]}
                    </div>

                    <div className="detail-badge">
                      <Users size={14} />
                      {place["Type of Tour Package"]}
                    </div>

                    <div className="detail-badge">
                      <Clock size={14} />
                      {place["No. of Days Preferred"]} Days
                    </div>
                  </div>

                  <div className="rating">
                    <span>Rating: </span>
                    <div className="stars">{renderStars(place["Rating"])}</div>
                    <span>({place["Rating"]})</span>
                  </div>

                  {place["Place URL"] ? (
                    <a href={place["Place URL"]} target="_blank" rel="noopener noreferrer" className="view-details">
                      View Details
                    </a>
                  ) : (
                    <span className="not-found">Details not found</span>
                  )}
                </div>
              ))
            ) : recommendations.length === 0 && !loading ? (
              <div className="empty-results">
                <h3>No Recommendations Yet</h3>
                <p>Fill out the form and click "Get Recommendations" to discover perfect destinations for your trip.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage

