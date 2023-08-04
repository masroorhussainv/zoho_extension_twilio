function appendToInput(value) {
  document.getElementById('output').value += value;
}

function clearInput() {
  document.getElementById('output').value = '';
}

function toggleDialPad() {
  var dialPad = document.getElementById('dial-pad');
  dialPad.classList.toggle('collapsed');
}
