// Three.js Smoke Background for About Section
let aboutCamera, aboutScene, aboutRenderer, aboutClock;
let aboutSmokeParticles = [];
let aboutSmokeMaterial, aboutSmokeGeo;

function initAboutBackground() {
    console.log('Initializing About Background...');
    
    // Get the about section container
    const aboutSection = document.querySelector('.section-about');
    if (!aboutSection) {
        console.error('About section not found');
        return;
    }

    aboutClock = new THREE.Clock();

    // Create renderer
    aboutRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    aboutRenderer.setSize(aboutSection.clientWidth || window.innerWidth, aboutSection.clientHeight || window.innerHeight);
    aboutRenderer.domElement.style.position = 'absolute';
    aboutRenderer.domElement.style.top = '0';
    aboutRenderer.domElement.style.left = '0';
    aboutRenderer.domElement.style.width = '100%';
    aboutRenderer.domElement.style.height = '100%';
    aboutRenderer.domElement.style.zIndex = '1';
    aboutRenderer.domElement.style.pointerEvents = 'none';
    aboutRenderer.domElement.id = 'about-three-canvas';
    
    // Add canvas to about section
    aboutSection.appendChild(aboutRenderer.domElement);
    console.log('Canvas added to about section');

    // Create scene
    aboutScene = new THREE.Scene();

    // Create camera
    aboutCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    aboutCamera.position.z = 1000;
    aboutScene.add(aboutCamera);

    // Create lighting
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-1, 0, 1);
    aboutScene.add(light);

    // Create smoke material without texture first (fallback)
    aboutSmokeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00dddd,
        transparent: true,
        opacity: 0.3
    });
    
    aboutSmokeGeo = new THREE.PlaneGeometry(300, 300);
    
    // Create smoke particles
    for (let p = 0; p < 50; p++) {
        const particle = new THREE.Mesh(aboutSmokeGeo, aboutSmokeMaterial);
        particle.position.set(
            Math.random() * 800 - 400,
            Math.random() * 600 - 300,
            Math.random() * 1000 - 500
        );
        particle.rotation.z = Math.random() * 360;
        aboutScene.add(particle);
        aboutSmokeParticles.push(particle);
    }
    
    console.log('Created', aboutSmokeParticles.length, 'smoke particles');
    
    // Start animation
    animateAboutBackground();
    
    // Try to load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = '';
    
    textureLoader.load(
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png',
        function(smokeTexture) {
            console.log('Smoke texture loaded');
            // Update material with texture
            aboutSmokeMaterial.map = smokeTexture;
            aboutSmokeMaterial.needsUpdate = true;
        },
        undefined,
        function(error) {
            console.error('Error loading smoke texture:', error);
            // Keep basic material
        }
    );
}

function animateAboutBackground() {
    if (!aboutRenderer || !aboutScene || !aboutCamera) return;
    
    const delta = aboutClock.getDelta();
    requestAnimationFrame(animateAboutBackground);
    evolveAboutSmoke(delta);
    renderAboutBackground();
}

function evolveAboutSmoke(delta) {
    const sp = aboutSmokeParticles.length;
    for (let i = 0; i < sp; i++) {
        aboutSmokeParticles[i].rotation.z += delta * 0.1;
        
        // Gentle floating motion
        aboutSmokeParticles[i].position.y += Math.sin(Date.now() * 0.001 + i) * 0.1;
        aboutSmokeParticles[i].position.x += Math.cos(Date.now() * 0.0008 + i) * 0.05;
    }
}

function renderAboutBackground() {
    if (aboutRenderer && aboutScene && aboutCamera) {
        aboutRenderer.render(aboutScene, aboutCamera);
    }
}

// Handle window resize
function onAboutWindowResize() {
    const aboutSection = document.querySelector('.section-about');
    if (aboutCamera && aboutRenderer && aboutSection) {
        aboutCamera.aspect = window.innerWidth / window.innerHeight;
        aboutCamera.updateProjectionMatrix();
        aboutRenderer.setSize(aboutSection.clientWidth || window.innerWidth, aboutSection.clientHeight || window.innerHeight);
    }
}

window.addEventListener('resize', onAboutWindowResize);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking for Three.js...');
    // Wait for Three.js to be loaded
    if (typeof THREE !== 'undefined') {
        console.log('Three.js found, initializing background');
        setTimeout(initAboutBackground, 100);
    } else {
        console.log('Three.js not found, waiting...');
        // Wait for Three.js library
        setTimeout(() => {
            if (typeof THREE !== 'undefined') {
                console.log('Three.js loaded after delay, initializing background');
                initAboutBackground();
            } else {
                console.error('Three.js still not available');
            }
        }, 2000);
    }
});