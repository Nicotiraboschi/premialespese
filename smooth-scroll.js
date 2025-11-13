// Smooth scroll per i bottoni
function initSmoothScroll() {
  // Trova tutti i link di scroll
  const scrollLinks = document.querySelectorAll('a[href*="#"]');
  
  scrollLinks.forEach(link => {
    // Rimuovi listener esistenti per evitare duplicati
    link.removeEventListener('click', handleSmoothScroll);
    link.addEventListener('click', handleSmoothScroll);
  });
}

function handleSmoothScroll(e) {
  e.preventDefault();
  
  const targetId = this.getAttribute('href');
  console.log('Attempting to scroll to:', targetId);
  
  const targetElement = document.querySelector(targetId);
  console.log('Target element found:', targetElement);
  
  if (targetElement) {
    console.log('Scrolling to element...');
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    console.error('Target element not found for:', targetId);
    // Fallback: try to wait a bit and retry
    setTimeout(() => {
      const retryTarget = document.querySelector(targetId);
      if (retryTarget) {
        console.log('Retry successful, scrolling now...');
        retryTarget.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.error('Retry failed for:', targetId);
      }
    }, 500);
  }
}

// Inizializza al caricamento
document.addEventListener('DOMContentLoaded', initSmoothScroll);

// Re-inizializza quando il contenuto viene modificato
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Aspetta un momento per assicurarsi che tutto sia renderizzato
      setTimeout(initSmoothScroll, 100);
    }
  });
});

// Osserva i cambiamenti nel main container
const mainContainer = document.getElementById('main-container');
if (mainContainer) {
  observer.observe(mainContainer, {
    childList: true,
    subtree: true
  });
}