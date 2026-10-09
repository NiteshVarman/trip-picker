import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./BackButton.css";

/**
 * Floating back-navigation button.
 * - Uses browser history (navigate(-1)) by default.
 * - Pass `to="/some-path"` to force a specific route.
 * - Fully theme-aware via CSS custom properties.
 */
export default function BackButton({ to }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="back-btn" onClick={handleClick} aria-label="Go back">
      <ArrowLeft size={18} strokeWidth={2.2} />
      <span className="back-btn__label">Back</span>
    </button>
  );
}
