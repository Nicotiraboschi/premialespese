// Portfolio Section Class
class PortfolioSection {
  constructor() {
    console.log('Portfolio section initialized');
  }
}

// Portfolio Slider functionality
const positions = [
  {
    height: 620,
    z: 220,
    rotateY: 48,
    y: 0,
    clip: "polygon(0px 0px, 100% 10%, 100% 90%, 0px 100%)"
  },
  {
    height: 580,
    z: 165,
    rotateY: 35,
    y: 0,
    clip: "polygon(0px 0px, 100% 8%, 100% 92%, 0px 100%)"
  },
  {
    height: 495,
    z: 110,
    rotateY: 15,
    y: 0,
    clip: "polygon(0px 0px, 100% 7%, 100% 93%, 0px 100%)"
  },
  {
    height: 420,
    z: 66,
    rotateY: 15,
    y: 0,
    clip: "polygon(0px 0px, 100% 7%, 100% 93%, 0px 100%)"
  },
  {
    height: 353,
    z: 46,
    rotateY: 6,
    y: 0,
    clip: "polygon(0px 0px, 100% 7%, 100% 93%, 0px 100%)"
  },
  {
    height: 310,
    z: 0,
    rotateY: 0,
    y: 0,
    clip: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
  },
  {
    height: 353,
    z: 54,
    rotateY: 348,
    y: 0,
    clip: "polygon(0px 7%, 100% 0px, 100% 100%, 0px 93%)"
  },
  {
    height: 420,
    z: 89,
    rotateY: -15,
    y: 0,
    clip: "polygon(0px 7%, 100% 0px, 100% 100%, 0px 93%)"
  },
  {
    height: 495,
    z: 135,
    rotateY: -15,
    y: 1,
    clip: "polygon(0px 7%, 100% 0px, 100% 100%, 0px 93%)"
  },
  {
    height: 580,
    z: 195,
    rotateY: 325,
    y: 0,
    clip: "polygon(0px 8%, 100% 0px, 100% 100%, 0px 92%)"
  },
  {
    height: 620,
    z: 240,
    rotateY: 312,
    y: 0,
    clip: "polygon(0px 10%, 100% 0px, 100% 100%, 0px 90%)"
  }
];

class CircularSlider {
  constructor() {
    this.container = document.getElementById("sliderContainer");
    this.track = document.getElementById("sliderTrack");
    this.cards = Array.from(document.querySelectorAll(".card"));
    this.totalCards = this.cards.length;
    this.isDragging = false;
    this.startX = 0;
    this.dragDistance = 0;
    this.threshold = 60;
    this.processedSteps = 0;
    this.expandedCard = null;
    this.cardInfo = document.getElementById("cardInfo");
    this.cardTitle = document.getElementById("cardTitle");
    this.cardDesc = document.getElementById("cardDesc");
    this.closeBtn = document.getElementById("closeBtn");

    this.init();
  }

  init() {
    this.applyPositions();
    this.attachEvents();
  }

  applyPositions() {
    if (!window.gsap) return;
    
    this.cards.forEach((card, index) => {
      const pos = positions[index];
      gsap.set(card, {
        height: pos.height,
        clipPath: pos.clip,
        transform: `translateZ(${pos.z}px) rotateY(${pos.rotateY}deg) translateY(${pos.y}px)`
      });
    });
  }

  expandCard(card) {
    if (this.expandedCard) return;

    this.expandedCard = card;
    const title = card.dataset.title;
    const desc = card.dataset.desc;

    this.cardTitle.textContent = title;
    this.cardDesc.textContent = desc;

    // Hide existing card info and prevent body scroll
    this.cardInfo.classList.remove("visible");
    document.body.style.overflow = 'hidden';

    const rect = card.getBoundingClientRect();
    const clone = card.cloneNode(true);
    const hoverOverlay = clone.querySelector(".hover-overlay");
    if (hoverOverlay) hoverOverlay.remove();

    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.margin = "0";
    clone.style.zIndex = "1000";
    clone.classList.add("clone");

    document.body.appendChild(clone);
    this.cardClone = clone;

    // Create overlay for click outside functionality
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999;
      opacity: 0;
    `;
    document.body.appendChild(overlay);
    this.cardOverlay = overlay;

    // Add click outside to close
    overlay.addEventListener('click', () => {
      this.closeCard();
    });

    gsap.set(card, { opacity: 0 });
    this.track.classList.add("blurred");

    // Ensure clone is above overlay
    clone.style.zIndex = "1000";

    // Animate overlay
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    const maxHeight = window.innerHeight * 0.8;
    const finalWidth = 500;
    const finalHeight = Math.min(650, maxHeight);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    gsap.to(clone, {
      width: finalWidth,
      height: finalHeight,
      left: centerX - finalWidth / 2,
      top: centerY - finalHeight / 2,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      transform: "translateZ(0) rotateY(0deg)",
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        // Don't show the original card info, we'll create a new one
        this.closeBtn.classList.add("visible");
        
        // Create and show dynamic card info
        this.showDynamicCardInfo(title, desc);
      }
    });
  }

  showDynamicCardInfo(title, desc) {
    // Remove any existing dynamic card info
    this.hideDynamicCardInfo();
    
    const cardInfoElement = document.createElement('div');
    cardInfoElement.className = 'dynamic-card-info';
    
    // Position it properly on screen
    cardInfoElement.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      opacity: 0;
      z-index: 1100;
      max-width: 600px;
      padding: 1.5rem;
      background: #ff6b35;
      box-shadow: 4px 3px 18px 4px rgba(183, 183, 183, 0.13);
      min-width: 375px;
      font-family: "Poppins", sans-serif;
      border-radius: 8px;
    `;
    
    // Responsive adjustments
    if (window.innerWidth <= 768) {
      cardInfoElement.style.cssText = `
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        opacity: 0;
        z-index: 1100;
        max-width: 90%;
        width: 90%;
        padding: 1rem;
        background: #ff6b35;
        box-shadow: 4px 3px 18px 4px rgba(183, 183, 183, 0.13);
        min-width: unset;
        font-family: "Poppins", sans-serif;
        border-radius: 8px;
      `;
    }
    
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    titleElement.style.cssText = `
      font-size: 36px;
      font-weight: 900;
      color: #0a0a0a;
      margin: 0 0 16px 0;
      text-shadow: none;
    `;
    
    const descElement = document.createElement('p');
    descElement.textContent = desc;
    descElement.style.cssText = `
      font-size: 18px;
      color: #080808;
      line-height: 1.7;
      margin: 0;
      text-shadow: none;
    `;
    
    // Mobile adjustments
    if (window.innerWidth <= 768) {
      titleElement.style.fontSize = '28px';
      titleElement.style.marginBottom = '12px';
      descElement.style.fontSize = '16px';
      descElement.style.lineHeight = '1.6';
    }
    
    cardInfoElement.appendChild(titleElement);
    cardInfoElement.appendChild(descElement);
    document.body.appendChild(cardInfoElement);
    
    this.dynamicCardInfo = cardInfoElement;
    
    // Animate in
    gsap.to(cardInfoElement, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out"
    });
  }

  hideDynamicCardInfo() {
    if (this.dynamicCardInfo) {
      this.dynamicCardInfo.remove();
      this.dynamicCardInfo = null;
    }
  }

  closeCard() {
    if (!this.expandedCard) return;

    this.cardInfo.classList.remove("visible");
    this.closeBtn.classList.remove("visible");
    
    // Remove dynamic card info if it exists
    this.hideDynamicCardInfo();
    
    // Re-enable body scroll
    document.body.style.overflow = 'auto';

    const card = this.expandedCard;
    const clone = this.cardClone;
    const overlay = this.cardOverlay;
    const rect = card.getBoundingClientRect();
    const index = this.cards.indexOf(card);
    const pos = positions[index];

    // Animate out overlay
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    gsap.to(clone, {
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      clipPath: pos.clip,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        clone.remove();
        if (overlay) overlay.remove();
        gsap.set(card, { opacity: 1 });
        this.track.classList.remove("blurred");
        this.expandedCard = null;
        this.cardClone = null;
        this.cardOverlay = null;
        
        // Ensure body scroll is re-enabled
        document.body.style.overflow = 'auto';
      }
    });
  }

  rotate(direction) {
    if (this.expandedCard) return;

    this.cards.forEach((card, index) => {
      let newIndex;
      if (direction === "next") {
        newIndex = (index - 1 + this.totalCards) % this.totalCards;
      } else {
        newIndex = (index + 1) % this.totalCards;
      }

      const pos = positions[newIndex];

      gsap.set(card, { clipPath: pos.clip });

      gsap.to(card, {
        height: pos.height,
        duration: 0.5,
        ease: "power2.out"
      });

      gsap.to(card, {
        transform: `translateZ(${pos.z}px) rotateY(${pos.rotateY}deg) translateY(${pos.y}px)`,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    if (direction === "next") {
      const firstCard = this.cards.shift();
      this.cards.push(firstCard);
      this.track.appendChild(firstCard);
    } else {
      const lastCard = this.cards.pop();
      this.cards.unshift(lastCard);
      this.track.prepend(lastCard);
    }
  }

  attachEvents() {
    this.cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!this.isDragging && !this.expandedCard) {
          this.expandCard(card);
        }
      });
    });

    this.closeBtn.addEventListener("click", () => this.closeCard());

    this.container.addEventListener("mousedown", (e) =>
      this.handleDragStart(e)
    );
    this.container.addEventListener(
      "touchstart",
      (e) => this.handleDragStart(e),
      { passive: false }
    );

    document.addEventListener("mousemove", (e) => this.handleDragMove(e));
    document.addEventListener("touchmove", (e) => this.handleDragMove(e), {
      passive: false
    });

    document.addEventListener("mouseup", () => this.handleDragEnd());
    document.addEventListener("touchend", () => this.handleDragEnd());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.expandedCard) {
        this.closeCard();
      } else if (e.key === "ArrowLeft" && !this.expandedCard) {
        this.rotate("prev");
      } else if (e.key === "ArrowRight" && !this.expandedCard) {
        this.rotate("next");
      }
    });
  }

  handleDragStart(e) {
    if (this.expandedCard) return;

    this.isDragging = true;
    this.container.classList.add("dragging");
    this.startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    this.dragDistance = 0;
    this.processedSteps = 0;
  }

  handleDragMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();
    const currentX = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;
    this.dragDistance = currentX - this.startX;

    const steps = Math.floor(Math.abs(this.dragDistance) / this.threshold);

    if (steps > this.processedSteps) {
      const direction = this.dragDistance > 0 ? "prev" : "next";
      this.rotate(direction);
      this.processedSteps = steps;
    }
  }

  handleDragEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.container.classList.remove("dragging");
  }
}

// Initialize portfolio slider when DOM is ready
function initPortfolioSlider() {
  if (!window.gsap) {
    setTimeout(initPortfolioSlider, 500);
    return;
  }
  
  const portfolioSection = document.querySelector('.section-portfolio');
  const sliderContainer = portfolioSection ? 
    portfolioSection.querySelector("#sliderContainer") : 
    document.getElementById("sliderContainer");
  const cards = portfolioSection ? 
    portfolioSection.querySelectorAll(".card") : 
    document.querySelectorAll(".card");
  
  if (sliderContainer && cards.length > 0 && window.gsap) {
    const slider = new CircularSlider();
    window.portfolioSlider = slider;
  } else {
    setTimeout(initPortfolioSlider, 500);
  }
}

// Initialize portfolio section
function initPortfolioSection() {
  if (!window.portfolioInstance) {
    window.portfolioInstance = new PortfolioSection();
    
    setTimeout(() => {
      initPortfolioSlider();
    }, 200);
  }
}

// Export for global use
window.PortfolioSection = PortfolioSection;
window.initPortfolioSlider = initPortfolioSlider;

// Start portfolio initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolioSection);
} else {
  setTimeout(initPortfolioSection, 100);
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new CircularSlider();
});