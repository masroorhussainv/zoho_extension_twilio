function switchFromDialerUiToCallUi() {
  // startCallTimeTracking()
  $callButton.prop('disabled', true);
  // $('#dialpad-ui').addClass('hide')
  $('.calling-phone-number').text($phoneNumberInput.val())
  $('#call-elapsed-duration').text(formatDuration(elapsedSeconds));
  // $('#active-call-ui').removeClass('hide')
  hideAllExcept('#active-call-ui')
  // outgoingCallHangupButton.classList.add("hide");
}

function switchFromCallUiToAfterCallUi() {
  // stopCallTimeTracking()
  console.log('switching to after call ui');
  // $('#active-call-ui').addClass('hide')
  hideAllExcept('#after-call-ui')
  $('.called-phone-number').text($phoneNumberInput.val())
  $('#call-duration-total').text(formatDuration(elapsedSeconds));
  // $('#after-call-ui').removeClass('hide')
}

function switchFromAfterCallUiToDialerUi() {
  $callButton.prop('disabled', false)
  hideAllExcept('#dialpad-ui')
  // $('#dialpad-ui').removeClass('hide')
  // $('#after-call-ui').addClass('hide')
}

function updateUIAcceptedOutgoingCall(call) {
  log("Call in progress ...");
  // hide the dialpad ui
  switchFromDialerUiToCallUi()

  // outgoingCallHangupButton.classList.remove("hide");
  // volumeIndicators.classList.remove("hide");
  // bindVolumeIndicators(call);
}

function updateUIDisconnectedOutgoingCall() {
  log("Call disconnected.");
  switchFromCallUiToAfterCallUi();
  // switchFromAfterCallUiToDialpadUi()

  // outgoingCallHangupButton.classList.add("hide");
  // volumeIndicators.classList.add("hide");
}

function updateUIAcceptedIncomingCall() {
  hideAllExcept('#incoming-call-ui')
}

function hideAllExcept(nestedSelector) {
  $(`#tabs-1 > div:not(${nestedSelector})`).addClass('hide');
  $(`#tabs-1 > ${nestedSelector}`).removeClass('hide');
}

function startCallTimeTracking() {
  callStartTime = new Date();
  callInterval = setInterval(updateCallDuration, 1000);
}

function updateCallDuration() {
  if (callStartTime) {
    const currentTime = new Date();
    elapsedSeconds = Math.round((currentTime - callStartTime) / 1000);
    console.log(`Call duration: ${elapsedSeconds} seconds`);
    // Update UI with the elapsedSeconds value
    $('#call-elapsed-duration').text(formatDuration(elapsedSeconds));
  }
}

function stopCallTimeTracking() {
  callEndTime = new Date();

  if (callInterval) {
    clearInterval(callInterval);
    callInterval = null; // Reset the interval variable
    let callDuration = $('#call-elapsed-duration')
    $(callDuration).text('00:00:00');
  }

  if (callStartTime) {
    const callDurationTotal = (callEndTime - callStartTime) / 1000; // Convert to seconds
    console.log(`Call ended. Duration: ${callDurationTotal} seconds`);
  } else {
    console.log('Call ended.');
  }
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function attachListenerToBackToDialerButton() {
  $('.back-to-dialer-btn').on('click', function () {
    switchFromAfterCallUiToDialerUi();
  });
}

function attachCallUiListeners() {
  attachListenerToBackToDialerButton();
}