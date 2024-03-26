<!-- 19，雾 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { getCurrentInstance, onMounted, nextTick, ref, reactive } from 'vue'

let { ctx } = getCurrentInstance() as any

onMounted(async () => {
    await nextTick()
    main()
})

function main() {
    let canvas = ctx.$refs.threeBox
    // 渲染器
    let renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas
    })

    // 渲染目标
    let rtWidth = 512
    let rtHeight = 512
    let renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight)

    let rtFov = 75
    let rtAspect = rtWidth / rtHeight
    let rtNear = 0.1
    let rtFar = 5
    let rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar)
    rtCamera.position.z = 2

    let rtScene = new THREE.Scene()
    rtScene.background = new THREE.Color('red')

    {
        let color = 0xFFFFFF
        let intensity = 3
        let light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-1, 2, 4)
        rtScene.add(light)
    }

    // 几何体
    let boxWidth = 1
    let boxHeight = 1
    let boxDepth = 1
    let geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

    // 多个网格
    function makeInstance(geometry: any, color: any, x: any) {
        let material = new THREE.MeshPhongMaterial({color})
        let cube = new THREE.Mesh(geometry, material)

        rtScene.add(cube)
        cube.position.x = x
        return cube
    }
    let rtCubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2)
    ]

    let fov = 75
    let aspect = 2
    let near = 0.1
    let far = 5
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2

    let scene = new THREE.Scene()

    {
        let color = 0xFFFFFF
        let intensity = 1
        let light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-1, 2, 4)
        scene.add(light)
    }

    let material = new THREE.MeshPhongMaterial({
        map: renderTarget.texture
    })
    let cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // 检查渲染器的canvas尺寸是不是和canvas的显示尺寸不一样
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
        time *= 0.001; // 将事件单位变为秒

        // 响应式
        if (resizeRendererToDisplaySize(renderer)) {
            let canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        // 单个
        // cube.rotation.x = time
        // cube.rotation.y = time

        // 多个
        rtCubes.forEach((cube, ndx) => {
            let speed = 1 + ndx * .1;
            let rot = time * speed;
            cube.rotation.x = rot
            cube.rotation.y = rot
        })

        renderer.setRenderTarget(renderTarget)
        renderer.render(rtScene, rtCamera)
        renderer.setRenderTarget(null)

        cube.rotation.x = time
        cube.rotation.y = time * 1.1

        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)

    // renderer.render(scene, camera)
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