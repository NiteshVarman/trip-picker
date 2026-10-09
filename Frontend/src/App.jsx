import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Home";
import India from "./pages/india";
import Place from "./pages/place";
import Login from "./pages/login";
import CategoryListings from "./pages/CategoryListings";
import ForgotPassword from "./pages/forgot";
import VerifyOTP from "./pages/verify";
import ResetPassword from "./pages/reset";
import Profile from "./pages/profile";
import Explore from "./pages/explore";
import { useState } from "react";
import Payment from "./pages/payment";
import Bookings  from "./pages/bookings";
import Packages from "./pages/packages";
import Reviews from "./pages/reviews";
import PackageDetails from "./pages/packagedetails";


export default function App() {
  const [firstLoading, setFirstLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home firstLoading={firstLoading} setFirstLoading={setFirstLoading}/>} />
        <Route path="/listings/indian" element={<India />} />
        <Route path="/listings/international" element={<CategoryListings endpoint="international" heading="International Tour Packages" />} />
        <Route path="/listings/educational"   element={<CategoryListings endpoint="educational"   heading="Educational Tour Packages" />} />
        <Route path="/listings/devotional"    element={<CategoryListings endpoint="devotional"    heading="Devotional Tour Packages" />} />
        <Route path="/listings/weekend"       element={<CategoryListings endpoint="weekend"       heading="Weekend Tour Packages" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/place/:stateName" element={<Place />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/payment/:title" element={<Payment />} />
        <Route path="/bookings" element={<Bookings  />} />
        <Route path="/packages" element={<Packages userLocation={userLocation} />} />
        <Route path="/reviews/:listingTitle" element={<Reviews />} />
        <Route path="/packagedetails" element={<PackageDetails />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
