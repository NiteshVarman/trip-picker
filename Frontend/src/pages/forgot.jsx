import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, KeyRound, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import "./auth.css";
import BackButton from "../components/BackButton";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=done
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email.trim()) {
      setMessage({ text: "Please enter your email address.", type: "error" });
      return;
    }
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );
      setStep(2);
      setMessage({ text: response.data.message || "OTP sent to your email.", type: "success" });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error sending OTP. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setMessage({ text: "Please enter the OTP.", type: "error" });
      return;
    }
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        { email, otp }
      );
      setStep(3);
      setMessage({ text: response.data.message || "OTP verified!", type: "success" });
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1800);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Invalid OTP. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const stepDone = (n) => step > n;
  const stepActive = (n) => step === n;

  return (
    <div className="auth-page">
      <BackButton to="/login" />

      <div className="auth-card">
        {/* Icon */}
        <div className="auth-icon">
          <Mail size={28} strokeWidth={1.8} />
        </div>

        <h2>Forgot Password</h2>
        <p className="auth-subtitle">
          {step === 1 && "Enter your email and we'll send you a one-time code."}
          {step === 2 && `We sent a code to ${email}. Enter it below.`}
          {step === 3 && "Verified! Redirecting you to reset your password…"}
        </p>

        {/* Step indicator */}
        <div className="auth-steps">
          <div className={`auth-step ${stepActive(1) ? "active" : ""} ${stepDone(1) ? "done" : ""}`}>
            <div className="auth-step__dot">
              {stepDone(1) ? <CheckCircle size={14} /> : "1"}
            </div>
            <span className="auth-step__label">Email</span>
          </div>
          <div className={`auth-step-connector ${stepDone(1) ? "done" : ""}`} />
          <div className={`auth-step ${stepActive(2) ? "active" : ""} ${stepDone(2) ? "done" : ""}`}>
            <div className="auth-step__dot">
              {stepDone(2) ? <CheckCircle size={14} /> : "2"}
            </div>
            <span className="auth-step__label">Verify OTP</span>
          </div>
          <div className={`auth-step-connector ${stepDone(2) ? "done" : ""}`} />
          <div className={`auth-step ${stepActive(3) ? "active" : ""}`}>
            <div className="auth-step__dot">3</div>
            <span className="auth-step__label">Reset</span>
          </div>
        </div>

        {/* Message banner */}
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.type === "error"
              ? <AlertCircle size={16} />
              : <CheckCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Step 1 — Email */}
        {step === 1 && (
          <>
            <div className="auth-form-group">
              <label htmlFor="fp-email">Email address</label>
              <input
                id="fp-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                autoFocus
              />
            </div>
            <button className="auth-btn" onClick={sendOtp} disabled={loading}>
              {loading ? "Sending…" : (
                <>Send OTP <ArrowRight size={16} style={{ marginLeft: 6, verticalAlign: "middle" }} /></>
              )}
            </button>
          </>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <>
            <div className="auth-form-group">
              <label htmlFor="fp-otp">One-time code</label>
              <input
                id="fp-otp"
                className="auth-input"
                type="text"
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                maxLength={6}
                autoFocus
              />
            </div>
            <button className="auth-btn" onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying…" : (
                <>Verify OTP <ArrowRight size={16} style={{ marginLeft: 6, verticalAlign: "middle" }} /></>
              )}
            </button>
            <div className="auth-footer" style={{ marginTop: 14 }}>
              Didn't receive it?{" "}
              <button onClick={() => { setStep(1); setMessage({ text: "", type: "" }); }}>
                Resend
              </button>
            </div>
          </>
        )}

        {/* Step 3 — Success */}
        {step === 3 && (
          <div className="auth-success-state">
            <div className="auth-success-icon">
              <CheckCircle size={32} />
            </div>
            <p>Your OTP has been verified.<br />Redirecting to reset your password…</p>
          </div>
        )}

        {/* Footer */}
        <div className="auth-footer">
          Remembered it? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
