document.addEventListener('DOMContentLoaded', function() {
  const collapsibleButtons = document.querySelectorAll('.collapsible-btn');

  collapsibleButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const elements  = document.querySelectorAll('.wrapper');
      const content = elements.length > 0 ? elements[0] : null;

      if (content.style.display === 'none') {
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }
    });
  });
});
