// Hero Section Class
class HeroSection {
  constructor() {
    this.app = null;
    this.canvas = null;
    this.init();
  }

  async init() {
    // Aspetta che l'elemento canvas sia disponibile
    await this.waitForCanvas();
    
    if (this.canvas) {
      await this.loadTubesCursor();
      this.setupEventListeners();
      console.log('🚀 Hero section with TubesCursor initialized successfully');
    } else {
      console.error('❌ Canvas element not found');
    }
  }

  waitForCanvas() {
    return new Promise((resolve) => {
      const checkCanvas = () => {
        this.canvas = document.getElementById('canvas');
        if (this.canvas) {
          console.log('✅ Canvas found:', this.canvas);
          resolve();
        } else {
          console.log('⏳ Waiting for canvas...');
          setTimeout(checkCanvas, 100);
        }
      };
      checkCanvas();
    });
  }

  async loadTubesCursor() {
    try {
      console.log('📦 Loading TubesCursor...');
      
      // Prova diversi URL per TubesCursor
      const urls = [
        'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js',
        'https://unpkg.com/threejs-components@0.0.19/build/cursors/tubes1.min.js',
        'https://cdn.skypack.dev/threejs-components@0.0.19/build/cursors/tubes1.min.js'
      ];
      
      for (const url of urls) {
        try {
          console.log(`🔄 Trying to load from: ${url}`);
          const module = await import(url);
          const TubesCursor = module.default;
          
          this.app = TubesCursor(this.canvas, {
            tubes: {
              colors: ["#f967fb", "#53bc28", "#6958d5"],
              lights: {
                intensity: 200,
                colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
              }
            }
          });
          
          console.log('✅ TubesCursor loaded successfully!');
          return;
        } catch (error) {
          console.log(`❌ Failed to load from ${url}:`, error);
        }
      }
      
      throw new Error('All TubesCursor URLs failed');
      
    } catch (error) {
      console.error('❌ Error loading TubesCursor:', error);
      console.log('🔄 Falling back to fallback effect...');
      this.setupFallbackEffect();
    }
  }

  setupFallbackEffect() {
    // Effetto di fallback semplice se TubesCursor non si carica
    console.log('🎨 Setting up fallback effect');
    const ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const particles = [];
    
    const animate = () => {
      ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
      
      // Aggiungi particelle casuali
      if (Math.random() < 0.1) {
        particles.push({
          x: Math.random() * this.canvas.offsetWidth,
          y: Math.random() * this.canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          color: ['#f967fb', '#53bc28', '#6958d5'][Math.floor(Math.random() * 3)]
        });
      }
      
      // Disegna e aggiorna particelle
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  setupEventListeners() {
    if (this.app && this.app.tubes) {
      console.log('🎯 Setting up TubesCursor event listeners');
      
      document.body.addEventListener('click', () => {
        const colors = this.randomColors(3);
        const lightsColors = this.randomColors(4);
        console.log('🎨 New colors:', colors, lightsColors);
        
        if (this.app.tubes) {
          this.app.tubes.setColors(colors);
          this.app.tubes.setLightsColors(lightsColors);
        }
      });
    } else {
      console.log('⚠️ TubesCursor not available, using fallback listeners');
    }
  }

  randomColors(count) {
    return new Array(count)
      .fill(0)
      .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
  }
}

// Inizializzazione robusta
function initHeroSection() {
  console.log('🚀 Initializing Hero section...');
  if (!window.heroInstance) {
    window.heroInstance = new HeroSection();
  }
}

// Esporta per uso globale
window.HeroSection = HeroSection;

// Inizializzazione multipla per essere sicuri
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSection);
} else {
  initHeroSection();
}

// Backup aggiuntivo
setTimeout(initHeroSection, 500);
window.addEventListener('load', initHeroSection);