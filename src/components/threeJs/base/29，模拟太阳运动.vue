<!-- 模拟太阳运动 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
        <div id="info"></div>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { getCurrentInstance, onMounted, nextTick, ref, reactive, render } from 'vue'

let { ctx } = getCurrentInstance() as any

onMounted(async () => {
    await nextTick()
    main()
})

function main() {
    const canvas = ctx.$refs.threeBox

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true,
        canvas
    })
    renderer.shadowMap.enabled = true

    let scene = new THREE.Scene()

    let camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.z = 5
    camera.position.y = 2
    camera.position.x = 2
    camera.lookAt(0, 0, 0)

    let controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.04
    // controls.update()

    let SphereGemoetry = new THREE.SphereGeometry(1, 20, 20)
    let meterial = new THREE.MeshPhongMaterial({
        color: 0xffffffff
    })

    let sphere = new THREE.Mesh(SphereGemoetry, meterial)
    sphere.castShadow = true

    let PlaneGeometry = new THREE.PlaneGeometry(50, 50)
    let plane = new THREE.Mesh(PlaneGeometry, meterial)
    plane.position.set(0, -1, 0)
    plane.rotation.x = -Math.PI/2
    plane.receiveShadow = true
    
    scene.add(plane)
    scene.add(sphere)

    let smallBall = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 20, 20),
        new THREE.MeshBasicMaterial({color: 0xff0000})
    )

    let light = new THREE.AmbientLight(0x222222,0.5)
    scene.add(light)

    let pointLight = new THREE.PointLight(0x666666,1)
    pointLight.castShadow = true
    pointLight.intensity = 10

    smallBall.add(pointLight)
    scene.add(smallBall)

    let axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    let clock = new THREE.Clock()

    function animate() {
        controls.update()
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        TWEEN.update()
    }
    animate()

    function render() {
        let time = clock.getElapsedTime()
        smallBall.position.x = Math.sin(time) * 5
        smallBall.position.y = Math.cos(time) * 5
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(render)

    }
    render()
}

</script>

<style scoped lang="scss">
.three-container {
  width: 100%;
  height: 100%;
  #three-box {
    width: 100%;
    height: 100%;
    display: block;
  }
}
#info {
  position: absolute;
  left: 1em;
  top: 1em;
  background: rgba(0,0,0,.8);
  padding: .5em;
  color: white;
  font-family: monospace;
}
</style>