document.addEventListener('DOMContentLoaded', function() {
  const collapsibleButtons = document.querySelectorAll('.collapsible-btn');

  collapsibleButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const content = this.nextElementSibling;

      if (content.style.display === 'none') {
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }
    });
  });
});
