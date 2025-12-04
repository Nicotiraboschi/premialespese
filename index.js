class SectionLoader {
  constructor() {
    this.sections = [
      { name: 'hero', path: 'sections/hero/hero.html' },
      { name: 'video', path: 'sections/video/video.html' },
      { name: 'portfolio', path: 'sections/portfolio/portfolio.html' },
    ];
    this.loadedScripts = new Set();
    this.loadedStyles = new Set();
    this.init();
  }

  async init() {
    // Forza scroll all'inizio
    window.scrollTo(0, 0);
    
    const container = document.getElementById('main-container');
    
    // Mostra loading indicator
    // this.showLoading(container);
    
    try {
      for (const section of this.sections) {
        await this.loadSection(section, container);
      }
      
      // Rimuovi loading indicator
      this.hideLoading(container);
      
      console.log('Tutte le sezioni sono state caricate con successo!');
    } catch (error) {
      console.error('Errore nel caricamento delle sezioni:', error);
      this.hideLoading(container);
    }
  }

  showLoading(container) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.id = 'section-loader';
    loadingDiv.textContent = 'Caricamento sezioni...';
    container.appendChild(loadingDiv);
  }

  hideLoading(container) {
    const loadingDiv = document.getElementById('section-loader');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  async loadSection(section, container) {
    try {
      console.log(`🔄 Caricamento sezione: ${section.name} da ${section.path}`);
      
      // Carica HTML
      const response = await fetch(section.path);
      console.log(`📄 Response per ${section.name}:`, response.status, response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} per ${section.path}`);
      }
      
      const html = await response.text();
      console.log(`📝 HTML caricato per ${section.name}, lunghezza:`, html.length);
      
      // Crea wrapper per la sezione
      const sectionDiv = document.createElement('div');
      sectionDiv.className = `section section-${section.name}`;
      sectionDiv.id = `section-${section.name}`;
      sectionDiv.innerHTML = html;
      
      container.appendChild(sectionDiv);
      console.log(`➕ Sezione ${section.name} aggiunta al DOM`);
      
      // Carica CSS
      console.log(`🎨 Caricamento CSS per ${section.name}`);
      await this.loadCSS(`sections/${section.name}/${section.name}.css`);
      
      // Carica JS
      console.log(`⚙️ Caricamento JS per ${section.name}`);
      await this.loadJS(`sections/${section.name}/${section.name}.js`);
      
      // Aggiungi animazione
      setTimeout(() => {
        sectionDiv.classList.add('loaded');
      }, 100);
      
      console.log(`✅ Sezione ${section.name} caricata con successo`);
      
    } catch (error) {
      console.error(`Errore nel caricamento della sezione ${section.name}:`, error);
      
      // Crea una sezione di fallback
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = `section section-${section.name}`;
      fallbackDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: #666;">
          <p>Errore nel caricamento della sezione ${section.name}</p>
        </div>
      `;
      container.appendChild(fallbackDiv);
    }
  }

  loadCSS(href) {
    return new Promise((resolve, reject) => {
      if (this.loadedStyles.has(href)) {
        resolve();
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => {
        this.loadedStyles.add(href);
        resolve();
      };
      link.onerror = () => {
        console.warn(`CSS non trovato: ${href}`);
        resolve(); // Non bloccare per CSS mancante
      };
      document.head.appendChild(link);
    });
  }

  loadJS(src) {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts.has(src)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.type = 'module';
      script.onload = () => {
        this.loadedScripts.add(src);
        resolve();
      };
      script.onerror = () => {
        console.warn(`Script non trovato: ${src}`);
        resolve(); // Non bloccare per script mancanti
      };
      document.body.appendChild(script);
    });
  }

  // Metodo per navigare tra le sezioni
  scrollToSection(sectionName) {
    const section = document.getElementById(`section-${sectionName}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Forza scroll all'inizio quando la pagina si carica
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Forza scroll all'inizio quando la pagina è completamente caricata
window.addEventListener('load', () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  window.sectionLoader = new SectionLoader();
});

// Funzione helper per navigazione
window.goToSection = function(sectionName) {
  if (window.sectionLoader) {
    window.sectionLoader.scrollToSection(sectionName);
  }
};

// Function to scroll to previous section
window.scrollToPreviousSection = function(currentSection) {
  // Define the section navigation flow
  const sectionFlow = {
    'video': 'hero',
    'about': 'video', 
    'smoke': 'about'
  };
  
  const previousSection = sectionFlow[currentSection];
  
  if (previousSection && window.sectionLoader) {
    window.sectionLoader.scrollToSection(previousSection);
  }
};