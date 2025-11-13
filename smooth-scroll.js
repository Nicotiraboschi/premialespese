// Smooth scroll per i bottoni
document.addEventListener('DOMContentLoaded', function() {
  // Trova tutti i link di scroll
  const scrollLinks = document.querySelectorAll('a[href*="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});