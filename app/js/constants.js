// require('dotenv').config()
//
// export const CONSTANTS = {
//   twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
//   twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
//   twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
//   backendAuthToken: process.env.BACKEND_AUTH_TOKEN
// }

const BACKEND_URLS = {
  baseURL: 'https://initially-equal-collie.ngrok-free.app',
  loginEndpoint: '/api/twilio_users/login',
  validateTokenEndpoint: '/api/twilio_users/validate_token',

  twilioApi: {
    authToken: '/api/twilio/auth_token',
    voice: '/api/twilio/voice'
  }
}