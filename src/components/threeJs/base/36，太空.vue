<script setup>
import  * as THREE from 'three'
import { onMounted } from 'vue'

const pointImage = new URL('../source/point.png', import.meta.url).href

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x4AB0F9, 0.015)
// scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
camera.position.z = 5

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

// Create a sphere
let sphereGeometry = new THREE.SphereGeometry(3, 32, 32)
let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xF3DC6B })
sphereMaterial.fog = false
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(0, 0, -80)
scene.add(sphere)

// Create a halo
let haloGeometry = new THREE.SphereGeometry(6, 32, 32)
let haloMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float time;
        void main() {
            float intensity = pow(0.1 + 0.3 * (sin(time * 4.0) + 1.0)/2.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * intensity;
        } 
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
})
let halo = new THREE.Mesh(haloGeometry, haloMaterial)
halo.position.set(0, 0, -81)
scene.add(halo)

let geometry = new THREE.BufferGeometry()
let positionVertices = []

// Create particles
let particleCount = 5000
for (let i = 0; i < particleCount; i++) {
    let x = THREE.MathUtils.randFloatSpread(200)
    let y = THREE.MathUtils.randFloatSpread(200)
    let z = THREE.MathUtils.randFloatSpread(200)
    positionVertices.push(x, y, z)
}

// Add positionVertices to the geometry
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionVertices, 3))

// Create a material
let material = new THREE.PointsMaterial({ color: 0xefefef })
material.transparent = true

// Create a points object and add it to the scene
let points = new THREE.Points(geometry, material)
scene.add(points)

const loader = new THREE.TextureLoader()
loader.load(pointImage, function(texture) {
    material.map = texture
    material.needsUpdate = true
})

function animate() {
    requestAnimationFrame(animate)
    haloMaterial.uniforms.time.value += 0.005
    let positions = points.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = positions[i + 2] + 0.05
        if (positions[i + 2] > 100) {
            positions[i + 2] = -100
        }
    }
    points.rotation.z += 0.001
    points.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
}

animate()

onMounted(() => {
    let canvas = document.getElementById('canvas')
    renderer = new THREE.WebGLRenderer({canvas:canvas})
    renderer.setSize(window.innerWidth, window.innerHeight)
})

</script>

<template>
    <div class="container">
        <canvas id="canvas"></canvas>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
}
#canvas {
    width: 100%;
    height: 100%;
    display: block;
}
</style>