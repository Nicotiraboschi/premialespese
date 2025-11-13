// Immediate Three.js Background - No delays
console.log('Loading Three.js background script...');

function startThreeBackground() {
    console.log('Attempting to start Three.js background...');
    
    if (!window.THREE) {
        console.log('THREE.js not available yet');
        return false;
    }
    
    const canvas = document.getElementById('portfolio-canvas');
    if (!canvas) {
        console.log('Canvas element not found');
        return false;
    }
    
    console.log('Starting Three.js initialization...');
    
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent
    
    console.log('Renderer created successfully');
    
    // Add some visible geometry
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xff6b35,
        wireframe: true 
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    console.log('Cube added to scene');
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    // Start animation immediately
    animate();
    console.log('Animation started - you should see a rotating orange cube');
    
    return true;
}

// Try to start immediately
if (document.readyState === 'complete') {
    startThreeBackground();
} else {
    // Try when DOM loads
    document.addEventListener('DOMContentLoaded', startThreeBackground);
    
    // Also try with a small delay
    setTimeout(startThreeBackground, 500);
    setTimeout(startThreeBackground, 1000);
    setTimeout(startThreeBackground, 2000);
}