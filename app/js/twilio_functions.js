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
const $incomingPhoneNumberEl = $("#incoming-number");

let elapsedSeconds = 0;
let callStartTime;
let callEndTime;
let callInterval;
let callDurationTotal = 0;
let isMicMuted = false; // Track the microphone mute state
let activeConnection; // Store the active connection

dialerPreLoading()

const incomingCallHangupButton = $("#button-hangup-incoming");
const incomingCallAcceptButton = $('#button-accept-incoming')
const incomingCallRejectButton = $("#button-reject-incoming");

// Activity log
function log(message) {
  console.log(message)
  // logDiv.innerHTML += `<p class="log-entry">&gt;&nbsp; ${message} </p>`;
  // logDiv.scrollTop = logDiv.scrollHeight;
}

function setUpTwilio() {

  // Todo: remove this hardcoded phone number
  $phoneNumberInput.val('+923000855440')

  attachUiListeners();

  let device;
  let twilioApiAccessToken;
  let twilioApiIdentity;

  // Event Listeners

  $callButton.on('click', (e) => {
      // Call button click
      e.preventDefault();

      outgoingPhoneNumber = $phoneNumberInput.val();
      if(!['', null, undefined].includes(outgoingPhoneNumber)) {
        console.log('making call to: ', outgoingPhoneNumber);
        // Todo: uncomment this makeOutgoingCall function call
        makeOutgoingCall();

        // setTimeout(() => {
        // //   Todo: remove this forced-call
        // //    and uncomment the above call to makeOutgoingCall
        //   console.log('call accept event emitted');
        //   handleAcceptedOutgoingCall();
        // }, 0)
      }
    }
  )
  getAudioDevicesButton.onclick = getAudioDevices;
  speakerDevices.addEventListener("change", updateOutputDevice);
  ringtoneDevices.addEventListener("change", updateRingtoneDevice);
  // startupButton.addEventListener('onclick', startupClient)

  // SETUP STEP 1:
  // Browser client should be started after a user gesture
  // to avoid errors in the browser console re: AudioContext
  startupClient();

  function getTwilioAuthToken() {
    return new Promise(function(resolve, reject) {
      let backendAuthHeader = localStorage.getItem('_twilioBackendAuthHeader')
      let url = `${BACKEND_URLS.baseURL}${BACKEND_URLS.twilioApi.authToken}`;
      // let url = `http://127.0.0.1:3000${BACKEND_URLS.twilioApi.authToken}`

      fetch(url, {
        method: "POST",
        headers: {
          "Authorization": backendAuthHeader,
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return response.text().then(text => {
              throw new Error(text);
            });
          }
        })
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error.toString());
        });
    });
  }

  function storeTwilioApiCredentials(token, identity) {
    localStorage.setItem('_twilioApiAccessToken', token)
    localStorage.setItem('_twilioApiIdentity', identity)
  }

  function deleteTwilioApiCredentials() {
    localStorage.setItem('_twilioApiAccessToken', '')
    localStorage.setItem('_twilioApiIdentity', '')
  }

  function refreshTwilioApiAccessToken() {
    deleteTwilioApiCredentials()
    startupClient()
  }

  // SETUP STEP 2: Request an Access Token
  async function startupClient() {
    log("Requesting Access Token...");

    try {
      twilioApiAccessToken = localStorage.getItem('_twilioApiAccessToken')
      twilioApiIdentity = localStorage.getItem('_twilioApiIdentity')

      if(['', null, undefined].includes(twilioApiAccessToken) || ['', null, undefined].includes(twilioApiIdentity)) {
        const data = await getTwilioAuthToken()
        log("Token fetched");
        twilioApiAccessToken = data.token;
        twilioApiIdentity = data.identity
        storeTwilioApiCredentials(twilioApiAccessToken, twilioApiIdentity)
      }

      setClientNameUI(twilioApiIdentity);
      initializeDevice();

    } catch (err) {
      log(err);
      log("An error occurred. See your browser console for more information.");
      showLoginUi()
    }
  }

  // SETUP STEP 3:
  // Instantiate a new Twilio.Device
  function initializeDevice() {
    // logDiv.classList.remove("hide");
    log("Initializing device");
    try {
      device = new Twilio.Device(twilioApiAccessToken, {
        logLevel: 1,
        // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions.
        codecPreferences: ["opus", "pcmu"]
      });

      log('adding device listeners')
      addDeviceListeners(device);

      // Device must be registered in order to receive incoming calls
      device.register();
    } catch(err) {
      console.log('Caught exception from device set up block')
      console.error(err)
      showLoginUi()
    }
  }

  // SETUP STEP 4:
  // Listen for Twilio.Device states
  function addDeviceListeners(device) {
    device.on("registered", function () {
      log("Twilio.Device Ready to make and receive calls!");
      dialerLoaded();
      // callControlsDiv.classList.remove("hide");
      // $phoneNumberInput.val(window.__twilioTargetPhoneNumber);
    });

    device.on("error", function (error) {
      log("Twilio.Device Error: " + error.message);
      refreshTwilioApiAccessToken()
    });

    device.on("incoming", handleIncomingCall);

    // Todo: remove this forced event for handling incoming call
    // setTimeout(()=> {
    //   handleIncomingCall({
    //     parameters: {
    //       From: '+923174020543'
    //     },
    //     accept: () => {
    //       log('simulating call accept')
    //     },
    //     reject: () => {
    //       log('simulating call reject')
    //     },
    //     disconnect: () => {
    //       log('simulating call reject')
    //     }
    //   })
    // }, 500)

    device.audio.on("deviceChange", updateAllAudioDevices.bind(device));

    // Show audio selection UI if it is supported by the browser.
    if (device.audio.isOutputSelectionSupported) {
      audioSelectionDiv.classList.remove("hide");
    }
  }

  // Function to toggle microphone mute state
  function toggleMicMute() {
    if (device) {
      const activeConnection = device.activeConnection();

      if (activeConnection) {
        const audioTracks = activeConnection.mediaStream.stream.getAudioTracks();

        if (audioTracks && audioTracks.length > 0) {
          audioTracks.forEach((track) => {
            track.enabled = !isMicMuted; // Toggle the enabled state
          });

          isMicMuted = !isMicMuted; // Toggle the mute state

          // Update UI button text based on the mute state
          muteButton.innerText = isMicMuted ? "Unmute Mic" : "Mute Mic";
        }
      }
    }
  }

  function handleAcceptedOutgoingCall() {
    // outgoingPhoneNumber = $phoneNumberInput.val()
    startCallTimeTracking();
    updateUIAcceptedOutgoingCall();
    if([null, undefined, ''].includes(outgoingPhoneNumber)) {
      outgoingPhoneNumber = $phoneNumberInput.val()
    }

    const muteButton = document.getElementById("mute-button");
    muteButton.addEventListener("click", toggleMicMute);

    // Todo: remove this forced-call
    // setTimeout(()=>{
    //   handleDisconnectedOutgoingCall()
    // }, 10000)
  }

  function handleDisconnectedOutgoingCall() {
    stopCallTimeTracking();
    updateUIDisconnectedOutgoingCall();
    outgoingPhoneNumber = null;
  }

  // MAKE AN OUTGOING CALL
  async function makeOutgoingCall() {
    var params = {
      // get the phone number to call from the DOM
      To: $phoneNumberInput.val(),
    };
    outgoingPhoneNumber = params.To;

    if (device) {
      log(`Attempting to call ${params.To} ...`);

      // Twilio.Device.connect() returns a Call object
      const call = await device.connect({ params });

      // add listeners to the Call
      // "accepted" means the call has finished connecting and the state is now "open"
      call.on("accept", handleAcceptedOutgoingCall);
      call.on("disconnect", handleDisconnectedOutgoingCall);
      call.on("cancel", handleDisconnectedOutgoingCall);

      outgoingCallHangupButton.on('click', () => {
        log("Hanging up ...");
        call.disconnect();
      });

    } else {
      log("Unable to make call.");
    }
  }

  // HANDLE INCOMING CALL

  function handleIncomingCall(call) {
    log(`Incoming call from ${call.parameters.From}`);
    incomingPhoneNumber = call.parameters.From;
    console.log('incoming phone:', incomingPhoneNumber);
    updateUIIncomingCall();

    //show incoming call div and incoming phone number
    // incomingCallDiv.classList.remove("hide");
    // $incomingPhoneNumberEl.html(call.parameters.From);

    //add event listeners for Accept, Reject, and Hangup buttons
    incomingCallAcceptButton.on('click', () => {
      acceptIncomingCall(call);
    })

    incomingCallRejectButton.on('click', () => {
      rejectIncomingCall(call);
    })

    incomingCallHangupButton.on('click', () => {
      hangupIncomingCall(call);
    })

    // add event listener to call object
    if(call.hasOwnProperty('on')) {
      call.on("cancel", handleCancelledIncomingCall);
      call.on("disconnect", handleDisconnectedIncomingCall);
      call.on("reject", handleDisconnectedIncomingCall);
    }
  }

  // ACCEPT INCOMING CALL

  function acceptIncomingCall(call) {
    call.accept();
    log("Accepted incoming call.");
    incomingPhoneNumber = call.parameters.From;

    startCallTimeTracking();
    updateUIAcceptedIncomingCall()

    //update UI
    incomingCallAcceptButton.addClass("hide");
    incomingCallRejectButton.addClass("hide");
    incomingCallHangupButton.removeClass("hide");
  }

  // REJECT INCOMING CALL

  function rejectIncomingCall(call) {
    call.reject();
    log("Rejected incoming call");
    resetIncomingCallUI('reject');
  }

  // HANG UP INCOMING CALL

  function hangupIncomingCall(call) {
    call.disconnect();
    stopCallTimeTracking();
    log("Hanging up incoming call");
    resetIncomingCallUI('hangup');
  }

  // HANDLE CANCELLED INCOMING CALL

  function handleDisconnectedIncomingCall() {
    log("Incoming call ended.");
    stopCallTimeTracking();
    resetIncomingCallUI('disconnect');
  }

  // MISC USER INTERFACE

  function setClientNameUI(clientName) {
    console.log(`clientName: ${clientName}`)
    // var div = document.getElementById("client-name");
    // if(div) {
    //   div.innerHTML = `Your client name: <strong>${clientName}</strong>`;
    // }
  }

  function handleCancelledIncomingCall() {
    hideIncomingCallHangupButton();
    switchFromIncomingCallUiToDialerUi();
    incomingPhoneNumber = null;
  }

  function resetIncomingCallUI(trigger) {
    hideIncomingCallHangupButton();

    if(trigger === 'reject') {
      switchFromIncomingCallUiToDialerUi();
    }
    else {
      switchFromCallUiToAfterCallUi();
    }

    incomingPhoneNumber = null;
    // $incomingPhoneNumberEl.html('');
    // incomingCallAcceptButton.removeClass("hide");
    // incomingCallRejectButton.removeClass("hide");
    // incomingCallHangupButton.addClass("hide");
    // incomingCallDiv.classList.add("hide");
  }

  // AUDIO CONTROLS

  async function getAudioDevices() {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    updateAllAudioDevices.bind(device);
  }

  function updateAllAudioDevices() {
    if (device) {
      updateDevices(speakerDevices, device.audio.speakerDevices.get());
      updateDevices(ringtoneDevices, device.audio.ringtoneDevices.get());
    }
  }

  function updateOutputDevice() {
    const selectedDevices = Array.from(speakerDevices.children)
      .filter((node) => node.selected)
      .map((node) => node.getAttribute("data-id"));

    device.audio.speakerDevices.set(selectedDevices);
  }

  function updateRingtoneDevice() {
    const selectedDevices = Array.from(ringtoneDevices.children)
      .filter((node) => node.selected)
      .map((node) => node.getAttribute("data-id"));

    device.audio.ringtoneDevices.set(selectedDevices);
  }

  function bindVolumeIndicators(call) {
    call.on("volume", function (inputVolume, outputVolume) {
      var inputColor = "red";
      if (inputVolume < 0.5) {
        inputColor = "green";
      } else if (inputVolume < 0.75) {
        inputColor = "yellow";
      }

      inputVolumeBar.style.width = Math.floor(inputVolume * 300) + "px";
      inputVolumeBar.style.background = inputColor;

      var outputColor = "red";
      if (outputVolume < 0.5) {
        outputColor = "green";
      } else if (outputVolume < 0.75) {
        outputColor = "yellow";
      }

      outputVolumeBar.style.width = Math.floor(outputVolume * 300) + "px";
      outputVolumeBar.style.background = outputColor;
    });
  }

  // Update the available ringtone and speaker devices
  function updateDevices(selectEl, selectedDevices) {
    selectEl.innerHTML = "";

    device.audio.availableOutputDevices.forEach(function (device, id) {
      var isActive = selectedDevices.size === 0 && id === "default";
      selectedDevices.forEach(function (device) {
        if (device.deviceId === id) {
          log(device);
          isActive = true;
        }
      });

      let option = document.createElement("option");
      option.label = device.label;
      option.setAttribute("data-id", id);
      if (isActive) {
        option.setAttribute("selected", "selected");
      }
      option.textContent = device.label;
      selectEl.appendChild(option);
    });
  }
}

