const crypto = require("crypto");
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const razorpay = require("../config/razorpay");
const generateBookingPDF = require("../utils/generatepdf");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  try {
    const { userId, listingTitle, amount, date, time, numAdults, numChildren, guestNames, contactNumber, altContactNumber, address } = req.body;
    
    const listing = await Listing.findOne({ title: listingTitle });
    if (!listing) {
      return res.status(400).json({ success: false, message: "Invalid listing title" });
    }
    
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount,
      userId,
      listingTitle,
      date,
      time,
      numAdults,
      numChildren,
      guestNames,
      contactNumber,
      altContactNumber,
      address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed", error });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      razorpay_signature,
      userId,
      listingTitle,
      amount,
      date,
      time,
      numAdults,
      numChildren,
      guestNames,
      contactNumber,
      altContactNumber,
      address,
    } = req.body;

    // ------------------------------------------------------------------
    // 1. Validate that all three Razorpay identifiers were supplied.
    //    Missing any one of them means the request is malformed or
    //    the payment dialog was never completed legitimately.
    // ------------------------------------------------------------------
    if (!orderId || !paymentId || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment identifiers. Verification failed.",
      });
    }

    // ------------------------------------------------------------------
    // 2. Verify the HMAC-SHA256 signature.
    //
    //    Razorpay signs: "<orderId>|<paymentId>" with RAZORPAY_KEY_SECRET.
    //    We recompute the same signature server-side and compare using
    //    timingSafeEqual to prevent timing-based side-channel attacks.
    //    The secret never leaves the server and is never included in any
    //    log or response.
    // ------------------------------------------------------------------
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const receivedSignatureBuf = Buffer.from(razorpay_signature, "hex");
    const expectedSignatureBuf = Buffer.from(expectedSignature, "hex");

    // Buffers must be the same length for timingSafeEqual; if they differ
    // the signature is definitely invalid.
    const signaturesMatch =
      receivedSignatureBuf.length === expectedSignatureBuf.length &&
      crypto.timingSafeEqual(receivedSignatureBuf, expectedSignatureBuf);

    if (!signaturesMatch) {
      // Log only the order ID for debugging — never log the signature itself.
      console.warn(`[verifyPayment] Signature mismatch for orderId: ${orderId}`);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // ------------------------------------------------------------------
    // 3. Signature is valid. Proceed with creating the booking record.
    // ------------------------------------------------------------------
    const listing = await Listing.findOne({ title: listingTitle });
    if (!listing) {
      return res.status(400).json({ success: false, message: "Invalid listing title" });
    }

    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);

    const newPayment = new Booking({
      orderId,
      transactionId: paymentId,
      user: new mongoose.Types.ObjectId(userId),
      listing: listingTitle,
      amount,
      date,
      time,
      numAdults,
      numChildren,
      guestNames,
      contactNumber,
      altContactNumber,
      address,
      status: "Paid",
      paymentStatus: "Completed",
      paymentMethod: "Razorpay",
      paymentGateway: "Razorpay",
      paymentDate: istTime.toISOString().split("T")[0],
      paymentTime: istTime.toISOString().split("T")[1].split(".")[0],
    });

    await newPayment.save();
    res.json({ success: true, message: "Payment successful!", booking: newPayment });
  } catch (error) {
    console.error("[verifyPayment] Unexpected error:", error.message);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

const generatePDF = async (req, res) => {
  try {
    const { orderId } = req.params;
    const bookingDetails = await Booking.findOne({ orderId });

    if (!bookingDetails) {
      return res.status(404).json({ success: false, message: "Booking not found!" });
    }

    generateBookingPDF(bookingDetails, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to generate PDF", error });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({ user: userId });
    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const listing = await Listing.findOne({ title: booking.listing });
        return {
          ...booking._doc,
          listing: listing ? { title: listing.title, place: listing.place, type: listing.type } : null,
        };
      })
    );
    res.json({ success: true, bookings: populatedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings", error });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const deletedBooking = await Booking.findOneAndDelete({ _id: id, user: userId });

    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found or unauthorized" });
    }

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to cancel booking" });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    let { guestNames, contactNumber } = req.body;
    const userId = req.userId;

    if (!Array.isArray(guestNames)) {
      guestNames = [guestNames];
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: id, user: userId },
      { guestNames, contactNumber },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found or unauthorized" });
    }

    res.json({ success: true, message: "Booking updated successfully", booking: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update booking" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  generatePDF,
  getMyBookings,
  cancelBooking,
  updateBooking,
};