function sendMessageToIframe(data) {
  let iframe = $('iframe #widgetTelephony');
  iframe.postMessage(data, '*')
}

window.addEventListener('message', function(event) {
  // Make sure to verify the origin for security reasons
  // console.log(event.data); // Outputs: 'Hello from parent'
  // let element = document.getElementById('phone-number');
  // console.log(element)
  // console.log($phoneNumberInput)
  $phoneNumberInput.val(event.data.Number)
}, false);