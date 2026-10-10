import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";
import "./auth.css";
import BackButton from "../components/BackButton";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email") || "";

  const handleReset = async () => {
    if (!password) {
      setMessage({ text: "Please enter a new password.", type: "error" });
      return;
    }
    if (password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setDone(true);
        setMessage({ text: data.message || "Password reset successfully!", type: "success" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage({ text: data.message || "Could not reset password.", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <BackButton to="/login" />

      <div className="auth-card">
        {/* Icon */}
        <div className="auth-icon">
          <Lock size={28} strokeWidth={1.8} />
        </div>

        <h2>Reset Password</h2>
        <p className="auth-subtitle">
          {done
            ? "Password updated! Redirecting to sign in…"
            : `Create a strong new password for ${email}`}
        </p>

        {/* Message banner */}
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.type === "error"
              ? <AlertCircle size={16} />
              : <CheckCircle size={16} />}
            {message.text}
          </div>
        )}

        {!done ? (
          <>
            {/* Email (read-only) */}
            <div className="auth-form-group">
              <label htmlFor="rp-email">Email</label>
              <input
                id="rp-email"
                className="auth-input"
                type="email"
                value={email}
                disabled
              />
            </div>

            {/* New password */}
            <div className="auth-form-group">
              <label htmlFor="rp-pw">New password</label>
              <div className="auth-input-wrap">
                <input
                  id="rp-pw"
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <button
                  className="auth-eye-btn"
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="auth-form-group">
              <label htmlFor="rp-confirm">Confirm password</label>
              <div className="auth-input-wrap">
                <input
                  id="rp-confirm"
                  className="auth-input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                />
                <button
                  className="auth-eye-btn"
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="auth-btn" onClick={handleReset} disabled={loading}>
              {loading ? "Updating…" : "Reset Password"}
            </button>
          </>
        ) : (
          <div className="auth-success-state">
            <div className="auth-success-icon">
              <ShieldCheck size={32} />
            </div>
            <p>Your password has been updated.<br />Taking you to sign in…</p>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
