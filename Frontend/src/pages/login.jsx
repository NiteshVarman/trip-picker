import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import "./login.css";
import BackButton from "../components/BackButton";

function Login() {
    const [tab, setTab] = useState("login"); // "login" | "register"
    const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [registerMessage, setRegisterMessage] = useState({ text: "", ok: false });
    const [loginMessage, setLoginMessage] = useState({ text: "", ok: false });
    const [showRegPw, setShowRegPw] = useState(false);
    const [showLoginPw, setShowLoginPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === "register") {
            setRegisterData(prev => ({ ...prev, [name]: value }));
        } else {
            setLoginData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateRegister = () => {
        const newErrors = {};
        const { name, email, password } = registerData;
        if (!name.trim()) newErrors.name = "Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!isValidEmail(email)) newErrors.email = "Invalid email format";
        if (!password.trim()) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Must be at least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateLogin = () => {
        const newErrors = {};
        const { email, password } = loginData;
        if (!email.trim()) newErrors.loginEmail = "Email is required";
        else if (!isValidEmail(email)) newErrors.loginEmail = "Invalid email format";
        if (!password.trim()) newErrors.loginPassword = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!validateRegister()) return;
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            });
            const data = await response.json();
            if (response.ok) {
                setRegisterMessage({ text: "Account created! You can now sign in.", ok: true });
                setRegisterData({ name: "", email: "", password: "" });
            } else {
                setRegisterMessage({ text: data.message || "Registration failed.", ok: false });
            }
        } catch {
            setRegisterMessage({ text: "Error connecting to the server.", ok: false });
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLogin()) return;
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            if (response.ok) {
                setLoginMessage({ text: "Login successful! Redirecting…", ok: true });
                login(data.token);
                navigate("/");
            } else {
                setLoginMessage({ text: data.message || "Invalid email or password.", ok: false });
            }
        } catch {
            setLoginMessage({ text: "Error connecting to the server.", ok: false });
        } finally {
            setLoading(false);
        }
    };

    const switchTab = (newTab) => {
        setTab(newTab);
        setErrors({});
        setLoginMessage({ text: "", ok: false });
        setRegisterMessage({ text: "", ok: false });
    };

    return (
        <div className="lp-page">
            <BackButton to="/" />

            <div className="lp-card">
                {/* ── Top accent bar ── */}
                <div className="lp-accent-bar" />

                {/* ── Brand mark ── */}
                <div className="lp-brand">
                    <span className="lp-brand__travel">Travel</span>
                    <span className="lp-brand__explorer">Explorer</span>
                </div>

                {/* ── Tab switcher ── */}
                <div className="lp-tabs" role="tablist">
                    <button
                        role="tab"
                        aria-selected={tab === "login"}
                        className={`lp-tab${tab === "login" ? " lp-tab--active" : ""}`}
                        onClick={() => switchTab("login")}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button
                        role="tab"
                        aria-selected={tab === "register"}
                        className={`lp-tab${tab === "register" ? " lp-tab--active" : ""}`}
                        onClick={() => switchTab("register")}
                        type="button"
                    >
                        Create Account
                    </button>
                </div>

                {/* ── Login Panel ── */}
                {tab === "login" && (
                    <div className="lp-panel">
                        <h2 className="lp-heading">Welcome Back</h2>
                        <p className="lp-subtitle">Sign in to continue your adventure</p>

                        <form onSubmit={handleLoginSubmit} noValidate>
                            <div className="lp-field">
                                <label className="lp-label" htmlFor="l-email">Email address</label>
                                <div className="lp-input-wrap">
                                    <span className="lp-field__icon"><Mail size={16} /></span>
                                    <input
                                        id="l-email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        className={`lp-input${errors.loginEmail ? " lp-input--error" : ""}`}
                                        value={loginData.email}
                                        onChange={(e) => handleChange(e, "login")}
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>
                                {errors.loginEmail && <span className="lp-err">{errors.loginEmail}</span>}
                            </div>

                            <div className="lp-field">
                                <label className="lp-label" htmlFor="l-pw">Password</label>
                                <div className="lp-input-wrap">
                                    <span className="lp-field__icon"><Lock size={16} /></span>
                                    <input
                                        id="l-pw"
                                        type={showLoginPw ? "text" : "password"}
                                        name="password"
                                        placeholder="Your password"
                                        className={`lp-input lp-input--pw${errors.loginPassword ? " lp-input--error" : ""}`}
                                        value={loginData.password}
                                        onChange={(e) => handleChange(e, "login")}
                                        autoComplete="current-password"
                                    />
                                    <button type="button" className="lp-eye" onClick={() => setShowLoginPw(p => !p)} aria-label="Toggle password visibility">
                                        {showLoginPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.loginPassword && <span className="lp-err">{errors.loginPassword}</span>}
                            </div>

                            <div className="lp-extras">
                                <label className="lp-remember">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="lp-forgot">Forgot password?</Link>
                            </div>

                            {loginMessage.text && (
                                <div className={`lp-msg ${loginMessage.ok ? "lp-msg--ok" : "lp-msg--err"}`}>
                                    {loginMessage.text}
                                </div>
                            )}

                            <button type="submit" className="lp-btn" disabled={loading}>
                                {loading ? "Signing in…" : <><span>Sign In</span><ArrowRight size={16} /></>}
                            </button>
                        </form>

                        <p className="lp-switch-hint">
                            Don't have an account?{" "}
                            <button type="button" className="lp-switch-link" onClick={() => switchTab("register")}>
                                Create one
                            </button>
                        </p>
                    </div>
                )}

                {/* ── Register Panel ── */}
                {tab === "register" && (
                    <div className="lp-panel">
                        <h2 className="lp-heading">Create Account</h2>
                        <p className="lp-subtitle">Start your journey with TripPicker</p>

                        <form onSubmit={handleRegisterSubmit} noValidate>
                            <div className="lp-field">
                                <label className="lp-label" htmlFor="r-name">Full name</label>
                                <div className="lp-input-wrap">
                                    <span className="lp-field__icon"><User size={16} /></span>
                                    <input
                                        id="r-name"
                                        type="text"
                                        name="name"
                                        placeholder="Your full name"
                                        className={`lp-input${errors.name ? " lp-input--error" : ""}`}
                                        value={registerData.name}
                                        onChange={(e) => handleChange(e, "register")}
                                        autoComplete="name"
                                        autoFocus
                                    />
                                </div>
                                {errors.name && <span className="lp-err">{errors.name}</span>}
                            </div>

                            <div className="lp-field">
                                <label className="lp-label" htmlFor="r-email">Email address</label>
                                <div className="lp-input-wrap">
                                    <span className="lp-field__icon"><Mail size={16} /></span>
                                    <input
                                        id="r-email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        className={`lp-input${errors.email ? " lp-input--error" : ""}`}
                                        value={registerData.email}
                                        onChange={(e) => handleChange(e, "register")}
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <span className="lp-err">{errors.email}</span>}
                            </div>

                            <div className="lp-field">
                                <label className="lp-label" htmlFor="r-pw">Password</label>
                                <div className="lp-input-wrap">
                                    <span className="lp-field__icon"><Lock size={16} /></span>
                                    <input
                                        id="r-pw"
                                        type={showRegPw ? "text" : "password"}
                                        name="password"
                                        placeholder="Minimum 6 characters"
                                        className={`lp-input lp-input--pw${errors.password ? " lp-input--error" : ""}`}
                                        value={registerData.password}
                                        onChange={(e) => handleChange(e, "register")}
                                        autoComplete="new-password"
                                    />
                                    <button type="button" className="lp-eye" onClick={() => setShowRegPw(p => !p)} aria-label="Toggle password visibility">
                                        {showRegPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <span className="lp-err">{errors.password}</span>}
                            </div>

                            {registerMessage.text && (
                                <div className={`lp-msg ${registerMessage.ok ? "lp-msg--ok" : "lp-msg--err"}`}>
                                    {registerMessage.text}
                                </div>
                            )}

                            <button type="submit" className="lp-btn" disabled={loading}>
                                {loading ? "Creating account…" : <><span>Create Account</span><ArrowRight size={16} /></>}
                            </button>
                        </form>

                        <p className="lp-switch-hint">
                            Already have an account?{" "}
                            <button type="button" className="lp-switch-link" onClick={() => switchTab("login")}>
                                Sign in
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
