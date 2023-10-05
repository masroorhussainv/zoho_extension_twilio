const BACKEND_URLS = {
  baseURL: 'https://initially-equal-collie.ngrok-free.app',
  loginEndpoint: '/api/twilio_users/login',
  validateTokenEndpoint: '/api/twilio_users/validate_token',

  twilioApi: {
    authToken: '/api/twilio/auth_token',
    voice: '/api/twilio/voice'
  }
}

const createObservableVariable = (initialValue) => {
  let value = initialValue;
  const listeners = [];

  return {
    get: () => value,
    set: (newValue) => {
      if (value !== newValue) {
        value = newValue;
        listeners.forEach(listener => listener(value));
      }
    },
    onChange: (listener) => {
      listeners.push(listener);
    }
  };
};

const speakerDevices = document.getElementById("speaker-devices");
const ringtoneDevices = document.getElementById("ringtone-devices");
const outputVolumeBar = document.getElementById("output-volume");
const inputVolumeBar = document.getElementById("input-volume");
const volumeIndicators = document.getElementById("volume-indicators");
const $callButton = $("#button-call");
const outgoingCallHangupButton = $("#button-hangup-outgoing");
// const callControlsDiv = document.getElementById("call-controls");
const audioSelectionDiv = document.getElementById("output-selection");
const getAudioDevicesButton = document.getElementById("get-devices");
const logDiv = document.getElementById("log");
const incomingCallDiv = document.getElementById("incoming-call");

const $phoneNumberInput = $("#phone-number");
let outgoingPhoneNumber = null;
let incomingPhoneNumber = null;
// let crmDialedPhoneNumber = null;

const $incomingPhoneNumberEl = $("#incoming-number");
const crmDialedPhoneNumber = createObservableVariable(null);

crmDialedPhoneNumber.onChange((newValue) => {
  console.log('The crmDialedPhoneNumber has changed to:', newValue);
});

let elapsedSeconds = 0;
let callStartTime;
let callEndTime;
let callInterval;
let callDurationTotal = 0;
let isMicMuted = false; // Track the microphone mute state
let activeConnection; // Store the active connection

const incomingCallHangupButton = $("#button-hangup-incoming");
const incomingCallAcceptButton = $('#button-accept-incoming')
const incomingCallRejectButton = $("#button-reject-incoming");

function attachIFrameMessageListenerEvent() {
  // attach event to receive messages from CRM in the iFrame code
  window.addEventListener('message', function(event) {
    // Make sure to verify the origin for security reasons
    $phoneNumberInput.val(event.data.Number)
  }, false);

}

function initialSetup() {
  attachIFrameMessageListenerEvent();
}

$(document).ready(function () {
  $('#login-container button[type="submit"]').on('click', submitLoginForm);
  initialSetup();
  checkLoggedInState();
});
