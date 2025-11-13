// Services Section JavaScript
class ServicesSection {
  constructor() {
    this.modal = null;
    this.serviceData = {
      fotovoltaico: {
        title: "Impianti Fotovoltaici",
        description: "Trasforma la tua casa in una centrale elettrica sostenibile",
        details: "I nostri impianti fotovoltaici utilizzano pannelli di ultima generazione con efficienza superiore al 22%. Ogni installazione include sistema di monitoraggio in tempo reale, inverter intelligenti e garanzia prodotto 25 anni.",
        benefits: ["Risparmio fino all'80% sulla bolletta", "Detrazione fiscale 50%", "Aumento valore immobile", "Zero emissioni CO2"]
      },
      eolico: {
        title: "Energia Eolica",
        description: "Cattura l'energia del vento per il tuo futuro sostenibile",
        details: "Le nostre turbine eoliche sono progettate per massima efficienza anche con venti leggeri. Ideali per aziende agricole, industriali e comunità che vogliono indipendenza energetica.",
        benefits: ["Energia pulita 24/7", "Bassi costi di manutenzione", "Perfetto per grandi spazi", "ROI in 5-7 anni"]
      },
      efficienza: {
        title: "Efficienza Energetica",
        description: "Ottimizza ogni watt per il massimo risparmio",
        details: "Audit completo dei tuoi consumi con tecnologie IoT avanzate. Identifichiamo sprechi nascosti e implementiamo soluzioni smart per ridurre i costi energetici.",
        benefits: ["Riduzione consumi fino al 40%", "Controllo remoto dispositivi", "Reportistica dettagliata", "Payback in 2-3 anni"]
      },
      accumulo: {
        title: "Sistemi di Accumulo", 
        description: "Immagazzina l'energia per quando ne hai bisogno",
        details: "Batterie al litio ferro fosfato con gestione intelligente dei carichi. Sistema modulare espandibile che si adatta alle tue esigenze energetiche.",
        benefits: ["Autonomia energetica", "Backup in blackout", "Gestione picchi di consumo", "App di controllo avanzata"]
      }
    };
    this.init();
  }

  init() {
    this.setupModal();
    this.setupAnimations();
    this.setupInteractions();
    console.log('Services section initialized');
  }

  setupModal() {
    // Verifica se il modal esiste, altrimenti lo crea
    this.modal = document.getElementById('serviceModal');
    if (!this.modal) {
      console.warn('Service modal not found');
      return;
    }

    // Setup close button
    const closeBtn = this.modal.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Close modal on outside click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'block') {
        this.closeModal();
      }
    });
  }

  setupAnimations() {
    // Animazione cards al scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 200);
        }
      });
    }, observerOptions);

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
      observer.observe(card);
    });

    // CSS per l'animazione
    const style = document.createElement('style');
    style.textContent = `
      .service-card.animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s ease;
      }
    `;
    document.head.appendChild(style);
  }

  setupInteractions() {
    // Hover effects per le service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  openServiceModal(serviceType) {
    if (!this.modal) {
      console.error('Modal not initialized');
      return;
    }

    const service = this.serviceData[serviceType];
    if (!service) {
      console.error('Service not found:', serviceType);
      return;
    }

    const modalContent = this.modal.querySelector('#modalContent');
    modalContent.innerHTML = `
      <h2>${service.title}</h2>
      <p class="modal-description">${service.description}</p>
      <div class="modal-details">
        <h3>Dettagli Tecnici</h3>
        <p>${service.details}</p>
        <h3>Vantaggi</h3>
        <ul class="modal-benefits">
          ${service.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-actions">
        <button class="modal-btn primary" onclick="window.servicesSection.requestQuote('${serviceType}')">
          Richiedi Preventivo
        </button>
        <button class="modal-btn secondary" onclick="window.servicesSection.closeModal()">
          Chiudi
        </button>
      </div>
    `;

    // Aggiungi stili per il modal content
    if (!document.getElementById('modalStyles')) {
      const modalStyles = document.createElement('style');
      modalStyles.id = 'modalStyles';
      modalStyles.textContent = `
        .modal-description {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
        }
        .modal-details h3 {
          color: #333;
          margin-bottom: 1rem;
          margin-top: 2rem;
        }
        .modal-benefits {
          list-style: none;
          padding: 0;
        }
        .modal-benefits li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }
        .modal-benefits li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4ade80;
          font-weight: bold;
        }
        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          justify-content: center;
        }
        .modal-btn {
          padding: 12px 30px;
          border-radius: 25px;
          border: 2px solid #667eea;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .modal-btn.primary {
          background: #667eea;
          color: white;
        }
        .modal-btn.secondary {
          background: transparent;
          color: #667eea;
        }
        .modal-btn:hover {
          transform: translateY(-2px);
        }
      `;
      document.head.appendChild(modalStyles);
    }

    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  requestQuote(serviceType) {
    // Simula richiesta preventivo
    alert(`Richiesta preventivo per ${this.serviceData[serviceType].title} inviata! Ti contatteremo presto.`);
    this.closeModal();
  }

  openContactModal() {
    // Placeholder per modal di contatto
    alert('Modal di contatto - Da implementare con form completo');
  }
}

// Funzioni globali per i bottoni onclick
window.openServiceModal = function(serviceType) {
  if (window.servicesSection) {
    window.servicesSection.openServiceModal(serviceType);
  }
};

window.openContactModal = function() {
  if (window.servicesSection) {
    window.servicesSection.openContactModal();
  }
};

// Inizializzazione
function initServicesSection() {
  const servicesSection = document.querySelector('.section-services');
  if (servicesSection && !window.servicesSection) {
    window.servicesSection = new ServicesSection();
  }
}

// Inizializza quando il documento è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initServicesSection);
} else {
  setTimeout(initServicesSection, 100);
}

// Export per uso esterno
window.ServicesSection = ServicesSection;