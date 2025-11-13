// Animazione SVG distruzione/ricomposizione per .svg-anim-title
if (typeof TimelineMax !== 'undefined') {
    var tmax_optionsGlobal = {
        repeat: -1,
        repeatDelay: 0.65,
        yoyo: true
    };

    if (window.CSSPlugin) CSSPlugin.useSVGTransformAttr = true;

    var tl = new TimelineMax(tmax_optionsGlobal),
            path = '.svg-anim-title > *',
            stagger_val = 0.0125,
            duration = 0.75;

    Array.from(document.querySelectorAll(path)).forEach(function(el) {
        tl.set(el, {
            x: '+=' + getRandom(-500, 500),
            y: '+=' + getRandom(-500, 500),
            rotation: '+=' + getRandom(-720, 720),
            scale: 0,
            opacity: 0
        });
    });

    var stagger_opts_to = {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        ease: Power4.easeInOut
    };

    tl.staggerTo(path, duration, stagger_opts_to, stagger_val);

    var $svg = document.querySelectorAll('.svg-anim-title');
    Array.from($svg).forEach(function(svg) {
        svg.addEventListener('mouseenter', function() {
            tl.timeScale(0.15);
        });
        svg.addEventListener('mouseleave', function() {
            tl.timeScale(1);
        });
    });
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
// Wait for Three.js and Stats.js to load
function loadSmokeEffect() {
    if (typeof THREE === 'undefined') {
        console.log('Three.js not loaded yet, waiting...');
        setTimeout(loadSmokeEffect, 500);
        return;
    }
    
    if (typeof Stats === 'undefined') {
        console.log('Stats.js not loaded yet, trying without it...');
        // Load Stats.js
        const statsScript = document.createElement('script');
        statsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r16/Stats.min.js';
        statsScript.onload = () => {
            initSmokeEffect();
        };
        statsScript.onerror = () => {
            console.log('Stats.js failed to load, continuing without it');
            window.Stats = function() {
                return {
                    setMode: () => {},
                    domElement: { style: {} },
                    begin: () => {},
                    end: () => {}
                };
            };
            initSmokeEffect();
        };
        document.head.appendChild(statsScript);
        return;
    }
    
    initSmokeEffect();
}

function initSmokeEffect() {
    var camera, scene, renderer,
        geometry, material, mesh,
        stats, clock, delta,
        textGeo, textTexture, textMaterial, text,
        light, smokeTexture, smokeMaterial, smokeGeo, smokeParticles,
        cubeSineDriver;

    init();
    animate();

    function init() {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        
        // Add to smoke section instead of body
        const smokeSection = document.getElementById('smoke-section');
        if (smokeSection) {
            smokeSection.appendChild(stats.domElement);
        }

        clock = new THREE.Clock();

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;
        scene.add(camera);

        geometry = new THREE.BoxGeometry(200, 200, 200); // Updated from CubeGeometry
        material = new THREE.MeshLambertMaterial({ color: 0xaa6666, wireframe: false });
        mesh = new THREE.Mesh(geometry, material);
        //scene.add( mesh );
        cubeSineDriver = 0;

        textGeo = new THREE.PlaneGeometry(300, 300);
        
        // Updated texture loading for newer Three.js
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = '';
        
        textTexture = loader.load(
            'businessimg.png',
            function(texture) {
                console.log('Text texture loaded');
            },
            function(progress) {
                console.log('Text loading progress:', progress);
            },
            function(error) {
                console.log('Text texture failed to load:', error);
            }
        );
        
        textMaterial = new THREE.MeshLambertMaterial({
            color: 0x00ffff,
            opacity: 1,
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

        smokeTexture = loader.load(
            'https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png',
            function(texture) {
                console.log('Smoke texture loaded');
            },
            function(progress) {
                console.log('Smoke loading progress:', progress);
            },
            function(error) {
                console.log('Smoke texture failed to load:', error);
            }
        );
        
        smokeMaterial = new THREE.MeshLambertMaterial({
            color: 0xff6b35, // orange like site accent
            map: smokeTexture,
            transparent: true
        });
        
        smokeGeo = new THREE.PlaneGeometry(300, 300);
        smokeParticles = [];

        for (var p = 0; p < 150; p++) {
            var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
            particle.position.set(
                Math.random() * 500 - 250,
                Math.random() * 500 - 250,
                Math.random() * 1000 - 100
            );
            particle.rotation.z = Math.random() * 360;
            scene.add(particle);
            smokeParticles.push(particle);
        }

        // Add to smoke section instead of body
        if (smokeSection) {
            smokeSection.appendChild(renderer.domElement);
        }
    }

    function animate() {
        // note: three.js includes requestAnimationFrame shim
        stats.begin();
        delta = clock.getDelta();
        requestAnimationFrame(animate);
        evolveSmoke();
        render();
        stats.end();
    }

    function evolveSmoke() {
        var sp = smokeParticles.length;
        while (sp--) {
            smokeParticles[sp].rotation.z += (delta * 0.2);
        }
    }

    function render() {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        cubeSineDriver += .01;
        mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Start loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSmokeEffect);
} else {
    loadSmokeEffect();
}

// Also try after a delay for dynamic loading
setTimeout(loadSmokeEffect, 1000);

// Function to scroll to previous section
function scrollToPreviousSection(currentSection) {
    // Define the section navigation flow
    const sectionFlow = {
        'video': 'hero',
        'about': 'video',
        'smoke': 'about'
    };
    
    const previousSection = sectionFlow[currentSection];
    
    if (previousSection && window.sectionLoader) {
        window.sectionLoader.loadSection(previousSection);
    }
}