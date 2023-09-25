// const BACKEND_URLS = {
//   baseURL: 'https://initially-equal-collie.ngrok-free.app',
//   loginEndpoint: '/api/twilio_users/login',
//   validateTokenEndpoint: '/api/twilio_users/validate_token'
// }

function initializeTwilioConfig(config_data={}) {
  console.log('setting up twilio now');
    console.log(config_data);
    TwilioNamespace.setUpTwilio(config_data)
    console.log('twilio set up initiated');
  }

function showPostLoginUi() {
  $('#login-container').hide()
  $('#tabs').show();
  console.log('going to set up twilio now');
  initializeTwilioConfig()
}

function showLoginUi() {
  // Todo: clear all auth related local data
  localStorage.setItem('_twilioBackendAuthHeader','')
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
  let token = localStorage.getItem('_twilioBackendAuthHeader')
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

function saveBackendAuthToken(token) {
  localStorage.setItem('_twilioBackendAuthHeader', token)
}

function loginRequest(payload) {
  $.ajax({
    url: `${BACKEND_URLS.baseURL}${BACKEND_URLS.loginEndpoint}`,
    method: 'POST',
    dataType: 'json',
    data: payload,
    success: function (response) {
      saveBackendAuthToken(response.token)
      showPostLoginUi()
    },
    error: function (xhr, status, error) {
      console.error(xhr, status, error);
    }
  });
}

function validateExtensionLoginToken(token) {
  $.ajax({
    url: `${BACKEND_URLS.baseURL}${BACKEND_URLS.validateTokenEndpoint}`,
    method: 'POST',
    data: { token: token },
    dataType: 'json',
    success: function(response) {
      console.log('validation succeeded');
      showPostLoginUi()
    },
    error: function (xhr, status, error) {
      console.log('validation failed');
      showLoginUi()
      // console.error(xhr, status, error);
    }
  });
}

function validateLoginForm() {
  let $emailField = $("#email");
  let $passwordField = $("#password");
  let email = $emailField.val();
  let password = $passwordField.val();

  // Regular expression for email validation
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let isValid = true;

  // Reset the styles and error messages
  $emailField.removeClass("invalid");
  $passwordField.removeClass("invalid");
  $("#email-error").text("");
  $("#password-error").text("");

  if (email === "") {
    isValid = false;
    $emailField.addClass("invalid");
    $("#email-error").text("Email must be filled out");
  } else if (!email.match(emailRegex)) {
    isValid = false;
    $emailField.addClass("invalid");
    $("#email-error").text("Invalid email format");
  }

  if (password === "") {
    isValid = false;
    $passwordField.addClass("invalid");
    $("#password-error").text("Password must be filled out");
  } else if (password.length < 8) {
    isValid = false;
    $passwordField.addClass("invalid");
    $("#password-error").text("Password must be at least 8 characters long");
  }
  return isValid;
}

function submitLoginForm(e) {
  e.preventDefault();
  console.log('submitting login form')
  if(validateLoginForm()) {
    let email = $("#email").val();
    let password = $("#password").val();
    loginRequest({ email, password })
  }
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