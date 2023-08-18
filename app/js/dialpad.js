function appendNumber(number) {
  var phoneNumberInput = document.getElementById("phone-number");
  phoneNumberInput.value += number;
}

function clearNumber() {
  var phoneNumberInput = document.getElementById("phone-number");
  phoneNumberInput.value = "";
}

function deleteLastDigit() {
  console.log('deleting last digit');
  var phoneNumberInput = document.getElementById("phone-number");
  phoneNumberInput.value = phoneNumberInput.value.slice(0, -1);
}
