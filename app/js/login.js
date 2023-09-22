const BACKEND = {
  baseURL: 'https://initially-equal-collie.ngrok-free.app',
  loginEndpoint: '/twilio/extension_login',
  validateTokenEndpoint: '/twilio/validate_extension_login_token'
}

function initializeTwilioConfig(config_data={}) {
    console.log('going to set up twilio now');
    console.log(config_data);
    TwilioNamespace.setUpTwilio(config_data)
    console.log('twilio set up initiated');
  }

function showPostLoginUi() {
  $('#login-container').hide()
  $('#tabs').show();
  initializeTwilioConfig()
}

function showLoginUi() {
  $('#login-container').show()
  $('#tabs').hide()
}

function showLoader() {
  // Todo: show loader
  $('#spinner-wrapper').show()
  $('#login-container').hide()
  $('#tabs').hide();
}

function hideLoader() {
  $('#spinner-wrapper').hide()
}

function checkLoggedInState() {
  console.log('Checking UI')
  showLoader()
  let token = localStorage.getItem('_twilio_extension_token')
  hideLoader()
  if (![null, undefined, ''].includes(token)) {
    console.log('token found');
    // validate the token
    validateExtensionLoginToken(token);
  } else {
    console.log('token not found');
    showLoginUi()
  }
}

function loginRequest() {
  $.ajax({
    url: `${BACKEND.baseURL}${BACKEND.loginEndpoint}`,
    method: 'POST',
    dataType: 'json',
    success: function (response) {
      showPostLoginUi()
    },
    error: function (xhr, status, error) {
      console.error(xhr, status, error);
    }
  });
}

function validateExtensionLoginToken(token) {
  $.ajax({
    url: `${BACKEND.baseURL}${BACKEND.validateTokenEndpoint}`,
    method: 'POST',
    data: { token: token },
    dataType: 'json',
    success: function(response) {
      if (response.status) {
        console.log('validation succeeded');
        showPostLoginUi()
      } else {
        console.log('validation failed');
        showLoginUi()
      }
    },
    error: function (xhr, status, error) {
      console.error(xhr, status, error);
    }
  });
}

function submitLoginForm(e) {
  e.preventDefault();
  console.log('submitting login form')
  loginRequest()
}

$(document).ready(function () {
  $('#login-container button[type="submit"]').on('click', submitLoginForm);
  checkLoggedInState();

  // // Apply jQuery UI styles to form elements
  // $("#username, #password").addClass("ui-widget ui-widget-content ui-corner-all");
  //
  // // Initialize the form as a jQuery UI widget
  // $("#login-form").dialog({
  //   autoOpen: false,
  //   modal: true,
  //   buttons: {
  //     "Login": function () {
  //       // Handle form submission here
  //       // You can add your login logic here
  //       alert("Login clicked!");
  //       // Close the dialog after processing
  //       $(this).dialog("close");
  //     },
  //     "Cancel": function () {
  //       $(this).dialog("close");
  //     }
  //   }
  // });
  //
  // // Open the login form dialog when the page loads
  // $("#login-form").dialog("open");
});