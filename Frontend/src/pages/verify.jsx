import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { KeyRound, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import "./auth.css";
import BackButton from "../components/BackButton";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email") || "";

  const handleVerify = async () => {
    if (!otp.trim()) {
      setMessage({ text: "Please enter the OTP.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setDone(true);
        setMessage({ text: data.message || "OTP verified!", type: "success" });
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1800);
      } else {
        setMessage({ text: data.error || "Invalid OTP. Please try again.", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <BackButton to="/forgot-password" />

      <div className="auth-card">
        {/* Icon */}
        <div className="auth-icon">
          <KeyRound size={28} strokeWidth={1.8} />
        </div>

        <h2>Verify OTP</h2>
        <p className="auth-subtitle">
          {done
            ? "Verified! Redirecting you to reset your password…"
            : `Enter the one-time code sent to ${email || "your email"}.`}
        </p>

        {/* Message banner */}
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            {message.text}
          </div>
        )}

        {!done ? (
          <>
            <div className="auth-form-group">
              <label htmlFor="v-otp">One-time code</label>
              <input
                id="v-otp"
                className="auth-input"
                type="text"
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                maxLength={6}
                autoFocus
              />
            </div>

            <button className="auth-btn" onClick={handleVerify} disabled={loading}>
              {loading ? "Verifying…" : (
                <>Verify OTP <ArrowRight size={16} style={{ marginLeft: 6, verticalAlign: "middle" }} /></>
              )}
            </button>
          </>
        ) : (
          <div className="auth-success-state">
            <div className="auth-success-icon">
              <CheckCircle size={32} />
            </div>
            <p>Your OTP has been verified.<br />Redirecting to reset your password…</p>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/forgot-password">← Back to Forgot Password</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
