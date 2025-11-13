var camera, scene, renderer,
    geometry, material, mesh, stats, clock, delta;
var textGeo, textTexture, textMaterial, text;
var light, smokeTexture, smokeMaterial, smokeGeo, smokeParticles = [];
var cubeSineDriver = 0;

function initPortfolioBackground() {
    // Trova il container della sezione portfolio
    const portfolioSection = document.querySelector('.section-portfolio');
    if (!portfolioSection) {
        console.log('Portfolio section not found!');
        return;
    }

    console.log('Portfolio section found, initializing background...');

    // Crea il container per il canvas
    const backgroundContainer = document.createElement('div');
    backgroundContainer.id = 'portfolio-background';
    backgroundContainer.style.position = 'absolute';
    backgroundContainer.style.top = '0';
    backgroundContainer.style.left = '0';
    backgroundContainer.style.width = '100%';
    backgroundContainer.style.height = '100%';
    backgroundContainer.style.zIndex = '0';
    backgroundContainer.style.pointerEvents = 'none';
    
    portfolioSection.style.position = 'relative';
    portfolioSection.insertBefore(backgroundContainer, portfolioSection.firstChild);

    console.log('Background container created');

    // Three.js setup
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x1a1a1a, 1);

    console.log('Renderer created');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    scene.add(camera);

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshLambertMaterial({ color: 0xff6b35, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);

    console.log('3D objects created');

    // Text setup
    textGeo = new THREE.PlaneGeometry(300, 300);
    
    // Create canvas texture for text
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ff6b35';
    context.font = 'Bold 60px Arial';
    context.textAlign = 'center';
    context.fillText('PORTFOLIO', 256, 200);
    context.fillText('3D', 256, 280);
    
    textTexture = new THREE.CanvasTexture(canvas);
    textMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff, 
        opacity: 0.8, 
        map: textTexture, 
        transparent: true, 
        blending: THREE.AdditiveBlending
    });
    text = new THREE.Mesh(textGeo, textMaterial);
    text.position.z = 800;
    scene.add(text);

    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-1, 0, 1);
    scene.add(light);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Create smoke texture programmatically
    const smokeCanvas = document.createElement('canvas');
    smokeCanvas.width = 256;
    smokeCanvas.height = 256;
    const smokeContext = smokeCanvas.getContext('2d');
    const gradient = smokeContext.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    smokeContext.fillStyle = gradient;
    smokeContext.fillRect(0, 0, 256, 256);
    
    smokeTexture = new THREE.CanvasTexture(smokeCanvas);
    smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff6b35, 
        map: smokeTexture, 
        transparent: true,
        opacity: 0.6
    });
    smokeGeo = new THREE.PlaneGeometry(300, 300);

    console.log('Smoke materials created');

    // Create smoke particles
    for (let p = 0; p < 100; p++) {
        const particle = new THREE.Mesh(smokeGeo, smokeMaterial.clone());
        particle.position.set(
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 100
        );
        particle.rotation.z = Math.random() * Math.PI * 2;
        particle.material.opacity = Math.random() * 0.5 + 0.1;
        scene.add(particle);
        smokeParticles.push(particle);
    }

    console.log('Smoke particles created: ', smokeParticles.length);

    backgroundContainer.appendChild(renderer.domElement);
    console.log('Renderer added to DOM');

    // Handle resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animatePortfolioBackground() {
    if (!renderer || !scene || !camera) return;
    
    requestAnimationFrame(animatePortfolioBackground);
    
    delta = clock.getDelta();
    evolveSmoke();
    renderPortfolio();
}

function evolveSmoke() {
    const sp = smokeParticles.length;
    for (let i = 0; i < sp; i++) {
        smokeParticles[i].rotation.z += delta * 0.2;
        
        // Gentle floating motion
        smokeParticles[i].position.y += Math.sin(Date.now() * 0.001 + i) * 0.5;
        smokeParticles[i].position.x += Math.cos(Date.now() * 0.0008 + i) * 0.3;
    }
}

function renderPortfolio() {
    if (mesh) {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        cubeSineDriver += 0.01;
        mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
    }
    
    if (text) {
        text.rotation.z += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded OR when portfolio section becomes visible
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeBackground, 100);
});

// Also try to initialize immediately if Three.js is available
if (typeof THREE !== 'undefined') {
    setTimeout(initializeBackground, 500);
}

function initializeBackground() {
    const portfolioSection = document.querySelector('.section-portfolio');
    if (!portfolioSection || portfolioSection.querySelector('#portfolio-background')) {
        return; // Already initialized or section not found
    }
    
    if (typeof THREE !== 'undefined') {
        initPortfolioBackground();
        animatePortfolioBackground();
        console.log('Three.js background initialized');
    } else {
        console.log('Three.js not loaded yet, retrying...');
        setTimeout(initializeBackground, 1000);
    }
}

// Cleanup function
function cleanupPortfolioBackground() {
    if (renderer) {
        renderer.dispose();
    }
    window.removeEventListener('resize', onWindowResize);
}