function switchFromDialerUiToCallUi() {
  // startCallTimeTracking()
  $callButton.prop('disabled', true);
  // $('#dialpad-ui').addClass('hide')
  // $('.calling-phone-number').text($phoneNumberInput.val())
  displayPhoneNumberDuringCall();
  displayElapsedCallTimeDuringActiveCall();
  // $('#call-elapsed-duration').text(getFormattedElapsedCallTime());
  // $('#active-call-ui').removeClass('hide')
  hideAllExcept('#active-call-ui')
  // outgoingCallHangupButton.classList.add("hide");
}

function displayCallDurationAfterCall() {
  $('#call-duration-total').text(getFormattedElapsedCallTime());
}

function switchFromCallUiToAfterCallUi() {
  console.log('switching to after call ui');
  hideAllExcept('#after-call-ui');
  displayOutgoingPhoneNumberAfterCall();
  displayCallDurationAfterCall();
  // $('.called-phone-number').text($phoneNumberInput.val())
  // $('#call-duration-total').text(getFormattedElapsedCallTime());
}

function switchFromAfterCallUiToDialerUi() {
  $callButton.prop('disabled', false)
  hideAllExcept('#dialpad-ui')
  // $('#dialpad-ui').removeClass('hide')
  // $('#after-call-ui').addClass('hide')
}

function switchFromIncomingCallUiToDialerUi() {
  hideAllExcept('#dialpad-ui')
}

function displayIncomingPhoneNumber() {
  $('#incoming-number').text(incomingPhoneNumber);
}

function displayPhoneNumberDuringCall() {
  $('#calling-phone-number').text(outgoingPhoneNumber);
}

function displayOutgoingPhoneNumberAfterCall() {
  $('#called-phone').text(outgoingPhoneNumber);
}

function displayElapsedCallTimeDuringActiveCall() {
  $('#active-call-ui #call-elapsed-duration').text(getFormattedElapsedCallTime())
}

function getFormattedElapsedCallTime() {
  return formatDuration(Math.ceil(callDurationTotal));
}

function updateUIAcceptedOutgoingCall() {
  log("Call in progress ...");
  // hide the dialpad ui
  switchFromDialerUiToCallUi();
  displayOutgoingCallHangupButton();

  // outgoingCallHangupButton.classList.remove("hide");
  // volumeIndicators.classList.remove("hide");
  // bindVolumeIndicators(call);
}

function updateUIDisconnectedOutgoingCall() {
  log("Call disconnected.");
  switchFromCallUiToAfterCallUi();
  hideOutgoingCallHangupButton();

  // switchFromAfterCallUiToDialpadUi()

  // outgoingCallHangupButton.classList.add("hide");
  // volumeIndicators.classList.add("hide");
}

function updateUIIncomingCall() {
  hideAllExcept('#incoming-call-ui');
  displayIncomingPhoneNumber();
}

function updateUIAcceptedIncomingCall() {
  hideAllExcept('#active-call-ui');
  displayPhoneNumberDuringCall();
  displayIncomingCallHangupButton();
}

function displayCallDurationOnUi() {
  $('#active-call-ui .call-duration').removeClass('hide');
}

function hideCallDurationFromUi() {
  $('#active-call-ui .call-duration').addClass('hide');
}

function displayOutgoingCallHangupButton() {
  $('#button-hangup-outgoing').removeClass('hide')
}
function hideOutgoingCallHangupButton() {
  $('#button-hangup-outgoing').addClass('hide')
}

function displayIncomingCallHangupButton() {
  $('#button-hangup-incoming').removeClass('hide')
}

function hideIncomingCallHangupButton() {
  $('#button-hangup-incoming').addClass('hide')
}

function hideAllExcept(nestedSelector) {
  $(`#tabs-1 > div:not(${nestedSelector})`).addClass('hide');
  $(`#tabs-1 > ${nestedSelector}`).removeClass('hide');
}

function startCallTimeTracking() {
  callStartTime = new Date();
  callInterval = setInterval(updateCallDuration, 1000);
  displayCallDurationOnUi();
}

function updateCallDuration() {
  console.log('callStartTime', callStartTime)
  if (callStartTime) {
    const currentTime = new Date();
    elapsedSeconds = Math.round((currentTime - callStartTime) / 1000);
    callDurationTotal = elapsedSeconds;
    console.log(`Call duration: ${elapsedSeconds} seconds`);
    // Update UI with the elapsedSeconds value
    console.log('updating ui with elapsed time', getFormattedElapsedCallTime());
    // console.log($('#call-elapsed-duration').text());
    $('#call-elapsed-duration').text(getFormattedElapsedCallTime());
  }
}

function stopCallTimeTracking() {
  callEndTime = new Date();

  if (callInterval) {
    clearInterval(callInterval);
    callInterval = null; // Reset the interval variable
    $('#call-elapsed-duration').text('00:00:00');
  }

  if (callStartTime) {
    elapsedSeconds = (callEndTime - callStartTime) / 1000; // Convert to seconds
    console.log(`Call ended. Duration: ${elapsedSeconds} seconds`);
  } else {
    console.log('Call ended.');
  }
  callDurationTotal = elapsedSeconds;
  elapsedSeconds = 0;
  hideCallDurationFromUi();
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

// function attachListenerToIncomingCallButtons() {
//   $('#button-accept-incoming').on('click', function () {
//
//   });
//   $('#button-reject-incoming').on('click', function () {
//
//   })
// }

function attachUiListeners() {
  // attachListenerToIncomingCallButtons();
  attachListenerToBackToDialerButton();
}
