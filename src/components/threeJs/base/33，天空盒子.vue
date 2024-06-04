<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getCurrentInstance, onMounted, nextTick, ref, reactive } from 'vue'

let { ctx } = getCurrentInstance() as any

onMounted(async () => {
    await nextTick()
    main()
})

function main() {
    let img1 = new URL('../source/sky/posx.jpg', import.meta.url).href
    let img2 = new URL('../source/sky/negx.jpg', import.meta.url).href
    let img3 = new URL('../source/sky/posy.jpg', import.meta.url).href
    let img4 = new URL('../source/sky/negy.jpg', import.meta.url).href
    let img5 = new URL('../source/sky/posz.jpg', import.meta.url).href
    let img6 = new URL('../source/sky/negz.jpg', import.meta.url).href
    let sky = [
        img1,
        img2,
        img3,
        img4,
        img5,
        img6
    ]

    let canvas = ctx.$refs.threeBox

    // 场景
    let scene = new THREE.Scene()
    // 盒子纹理加载器
    let cubeLoader = new THREE.CubeTextureLoader()
    scene.background = cubeLoader.load(sky)
    // scene.opacity = 0

    // 相机
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.z = 500
    camera.lookAt(scene.position)

    // 渲染器
    let renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 控制器
    let controls = new OrbitControls(camera, canvas)
    controls.update()

    // 灯光
    let ambientLight = new THREE.AmbientLight('#ffffff', 1)
    scene.add(ambientLight)

    function resizeRendererToDisplaySize(renderer: any) {
        let canvas = renderer.domElement
        let pixelRatio = window.devicePixelRatio
        let width = canvas.clientWidth * pixelRatio | 0
        let height = canvas.clientHeight * pixelRatio | 0
        let needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
            renderer.setSize(width, height, false)
        }
        return needResize
    }

    function render(time: number) {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }
        controls.update();
        renderer.render( scene, camera );

		requestAnimationFrame( render );
    }

    requestAnimationFrame(render)
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
</style>
