import * as THREE from 'three'
import gsap from 'gsap'
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const sphereTexture = textureLoader.load('textures/kepler.png')

sphereTexture.wrapS = THREE.RepeatWrapping;
sphereTexture.wrapT = THREE.RepeatWrapping;

// Material
const material = new THREE.MeshStandardMaterial({
    map: sphereTexture,
    roughness: 1, 
    metalness: 0.1,
})

// Mesh
const geometry = new THREE.SphereGeometry(1, 64, 64);
const sphere = new THREE.Mesh(geometry, material)
sphere.position.x = 1
sphere.position.y = 0
sphere.position.z = -1
scene.add(sphere)


// Lighting
const ambientLight = new THREE.AmbientLight(0x404040,3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x80ff80, 3);
directionalLight.position.set(-5,2,3);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// shpere position
const arr = [
    {
        id: 'first',
        x: 1,
        y: 0,
        z: -1
    },
    {
        id: 'second',
        x: -1,
        y: 0,
        z: -1
    },
    {
        id: 'third',
        x: 0,
        y: -1.25,
        z: 1
    }
]

const movePlanet = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection = 0;

    sections.forEach((section) => {  
        const rect = section.getBoundingClientRect();
        if(rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });

    let active = arr.find((el) => el.id === currentSection);
    if(active){
        // Replace direct position updates with GSAP animatio
        gsap.to(sphere.position, {
            x: active.x,
            y: active.y,
            z: active.z,
            duration: 3,
            ease: "power1.out"
        });
    }
}

/**
 * Scroll 
 */
window.addEventListener('scroll', () => {
    movePlanet();
})


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate the sphere
    sphere.rotation.y += 0.003;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()