// if you just don't want to read the code but still are interested in how it works, here's a guide for you: https://codepen.io/towc/blog/a-guide-to-wavy-waved-radial-waves/

function initCanvasAnimation() {
  // Aspetta che il DOM sia completamente caricato
  setTimeout(() => {
    var c = document.getElementById('c');
    if (!c) {
      console.log('Canvas not found! Trying again...');
      // Prova di nuovo dopo un po'
      setTimeout(initCanvasAnimation, 500);
      return;
    }
    console.log('Canvas found, initializing animation...', c);

var w = c.width = window.innerWidth,
		h = c.height = window.innerHeight,
		ctx = c.getContext('2d'),

		opts = {

			rays: 30,
			maxRadius: Math.sqrt( w*w/4 + h*h/4 ),
			circleRadiusIncrementAcceleration: 2,
			radiantSpan: .4,
			rayAngularVelSpan: .005,
			rayAngularVelLineWidthMultiplier: 60,
			rayAngularAccWaveInputBaseIncrementer: .03,
			rayAngularAccWaveInputAddedIncrementer: .02,
			rayAngularAccWaveMultiplier: .0003,
			baseWaveInputIncrementer: .01,
			addedWaveInputIncrementer: .01,
			circleNumWaveIncrementerMultiplier: .1,
			
			cx: w / 2,
			cy: h / 2,
			tickHueMultiplier: 1,
			shadowBlur: 0,
			repaintAlpha: .2,
			apply: init
		},
		
		rays = [],
		tick = 0,
		tickHueMultiplied;

function init(){
	
	rays.length = 0;
	for( var i = 0; i < opts.rays; ++i )
		rays.push( new Ray );
	
	if( tick === 0 ){
		loop();
	}
}

function loop(){
	
	window.requestAnimationFrame( loop );
	
  ++tick;
	
	ctx.globalCompositeOperation = 'source-over';
	ctx.shadowBlur = 0;
	ctx.clearRect( 0, 0, w, h );
	ctx.shadowBlur = opts.shadowBlur;
	ctx.globalCompositeOperation = 'lighter';
	
	tickHueMultiplied = opts.tickHueMultiplier * tick;
	
	rays.map( function( ray ){ ray.step(); } );
}

function Ray(){
	
	this.circles = [ new Circle( 0 ) ];
	this.rot = Math.random() * Math.PI * 2;
	this.angularVel = Math.random() * opts.rayAngularVelSpan * ( Math.random() < .5 ? 1 : -1 );
	this.angularAccWaveInput = Math.random() * Math.PI * 2;
	this.angularAccWaveInputIncrementer = opts.rayAngularAccWaveInputBaseIncrementer + opts.rayAngularAccWaveInputAddedIncrementer * Math.random();
	
	var security = 100,
			count = 0;
	
	while( --security > 0 && this.circles[ count ].radius < opts.maxRadius )
		this.circles.push( new Circle( ++count ) );
}
Ray.prototype.step = function(){
	
	// this is just messy, but if you take your time to read it properly you'll understand it pretty easily
	this.rot += 
		this.angularVel += Math.sin( 
			this.angularAccWaveInput += 
				this.angularAccWaveInputIncrementer ) * opts.rayAngularAccWaveMultiplier;
	
	var rot = this.rot,
			x = opts.cx,
			y = opts.cy;
	
	ctx.lineWidth = Math.min( .00001 / Math.abs( this.angularVel ), 10 / opts.rayAngularVelLineWidthMultiplier ) * opts.rayAngularVelLineWidthMultiplier;

	ctx.beginPath();
	ctx.moveTo( x, y );
	
	for( var i = 0; i < this.circles.length; ++i ){
		
		var circle = this.circles[ i ];
		
		circle.step();
		
		rot += circle.radiant;
		
		var x2 = opts.cx + Math.sin( rot ) * circle.radius,
				y2 = opts.cy + Math.cos( rot ) * circle.radius,
				
				mx = ( x + x2 ) / 2,
				my = ( y + y2 ) / 2;
		
		ctx.quadraticCurveTo( x, y, mx, my );
		
		x = x2;
		y = y2;
	}
	
	ctx.strokeStyle = ctx.shadowColor = 'hsl(hue,80%,50%)'.replace( 'hue', ( ( ( rot + this.rot ) / 2 ) % ( Math.PI * 2 ) ) / Math.PI * 30 + tickHueMultiplied );
	
	ctx.stroke();
}

function Circle( n ){
	
	this.radius = opts.circleRadiusIncrementAcceleration * Math.pow( n, 2 );
	this.waveInputIncrementer = ( opts.baseWaveInputIncrementer + opts.addedWaveInputIncrementer * Math.random() ) * ( Math.random() < .5 ? 1 : -1 ) * opts.circleNumWaveIncrementerMultiplier * n;
	this.waveInput = Math.random() * Math.PI * 2;
	this.radiant = Math.random() * opts.radiantSpan * ( Math.random() < .5 ? 1 : -1 );
}
Circle.prototype.step = function(){
	
	this.waveInput += this.waveInputIncrementer;
	this.radiant = Math.sin( this.waveInput ) * opts.radiantSpan;
}
init();

window.addEventListener( 'resize', function(){
	
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
	
	opts.maxRadius = Math.sqrt( w*w/4 + h*h/4 );
	opts.cx = w / 2;
	opts.cy = h / 2;
	
	init();
});
c.addEventListener( 'click', function(e){
	
	opts.cx = e.clientX;
	opts.cy = e.clientY;
	
});
  }, 100);
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCanvasAnimation);
} else {
  setTimeout(initCanvasAnimation, 100);
}

// Load Three.js dynamically if not available
function loadThreeJS(callback) {
    if (typeof THREE !== 'undefined') {
        callback();
        return;
    }
    
    console.log('📦 Loading Three.js library...');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = function() {
        console.log('✅ Three.js loaded successfully');
        callback();
    };
    script.onerror = function() {
        console.error('❌ Failed to load Three.js');
    };
    document.head.appendChild(script);
}

// Three.js Smoke Background for About Section - Replace existing canvas animation
function initAboutThreeBackground() {
    console.log('🌟 Initializing Three.js smoke background...');
    
    loadThreeJS(function() {
        // Get the existing canvas
        const canvas = document.getElementById('c');
        if (!canvas) {
            console.error('Canvas #c not found');
            setTimeout(initAboutThreeBackground, 500);
            return;
        }

        console.log('✅ Canvas found and Three.js loaded');

        // Clear any existing canvas content
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create Three.js renderer using the existing canvas
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true, 
            antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background

        // Create scene
        const scene = new THREE.Scene();

        // Create camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        // Create lighting
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(-1, 0, 1);
        scene.add(light);

        // Create smoke material
        const smokeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.8
        });
        
        const smokeGeo = new THREE.PlaneGeometry(200, 200);
        const smokeParticles = [];
        
        // Create smoke particles
        for (let p = 0; p < 50; p++) {
            const particle = new THREE.Mesh(smokeGeo, smokeMaterial);
            particle.position.set(
                Math.random() * 800 - 400,
                Math.random() * 600 - 300,
                Math.random() * 500 - 250
            );
            particle.rotation.z = Math.random() * Math.PI * 2;
            scene.add(particle);
            smokeParticles.push(particle);
        }
        
        console.log('🔥 Created', smokeParticles.length, 'smoke particles');

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Animate particles
            const time = Date.now() * 0.001;
            smokeParticles.forEach((particle, i) => {
                particle.rotation.z += 0.01;
                particle.position.y += Math.sin(time + i) * 0.5;
                particle.position.x += Math.cos(time * 0.7 + i) * 0.3;
                
                // Reset position if too far
                if (particle.position.y > 400) {
                    particle.position.y = -400;
                    particle.position.x = Math.random() * 800 - 400;
                }
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('🚀 Three.js animation started');

        // Handle window resize
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    });
}

// Replace the existing canvas animation with Three.js
setTimeout(() => {
    initAboutThreeBackground();
}, 1500);

// Function to scroll to previous section
function scrollToPreviousSection() {
    // Get current section
    const currentSection = document.getElementById('about-section');
    
    // Find the previous section in the sections array
    const sections = ['hero', 'video', 'about', 'smoke'];
    const currentIndex = sections.findIndex(section => section === 'about');
    
    if (currentIndex > 0) {
        const previousSection = sections[currentIndex - 1];
        
        // Use the SectionLoader to navigate to previous section
        if (window.sectionLoader) {
            window.sectionLoader.loadSection(previousSection);
        }
    }
}