const mongoose = require("mongoose");

// ----- Address Schema -----
const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    phone: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  { _id: false }
);

// ----- Payment Method Schema -----
const paymentMethodSchema = new mongoose.Schema(
  {
    cardType: { type: String },
    cardHolder: { type: String },
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String },
  },
  { _id: false }
);

// ----- User Schema -----
const userSchema = new mongoose.Schema(
  {
    // Shared/unique fields
    username: { type: String }, // Optional, from website
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Only required in app, website may not use it
    phone: { type: String },

    // App-specific
    address: { type: addressSchema },
    paymentMethods: [paymentMethodSchema],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    emailNotification: { type: Boolean, default: true },
    smsNotification: { type: Boolean, default: false },
    appNotification: { type: Boolean, default: true },

    // Website-specific
    ip: { type: String },
    region: { type: String },
    otp: { type: String },
    otp_expire_at: { type: Date },
    installer_expire_at: { type: Date, default: null },
    production_email_status: { type: Boolean },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Common
    roles: {
      type: String,
      enum: ["user", "installer", "member", "production" ,  "admin"],
      default: "user",
    },

    profilePicture: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
