require('dotenv').config()

export const CONSTANTS = {
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  backendAuthToken: process.env.BACKEND_AUTH_TOKEN
}