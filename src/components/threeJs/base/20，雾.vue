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
    let gui = new GUI()

    // 相机
    let fov = 75
    let aspect = 2
    let near = 0.1
    let far = 5
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2

    class FogGUIHelper {
        constructor(fog, backgroundColor) {
            this.fog = fog
            this.backgroundColor = backgroundColor
        }
        get near() {
            return this.fog.near
        }
        set near(v) {
            this.fog.near = v
            this.fog.far = Math.max(this.fog.far, v)
        }
        get far() {
            return this.fog.far
        }
        set far(v) {
            this.fog.far = v
            this.fog.near = Math.min(this.fog.near, v)
        }
        get color() {
            return `#${this.fog.color.getHexString()}`
        }
        set color(hexString) {
            this.fog.color.set(hexString)
            this.backgroundColor.set(hexString)
        }
    }

    // 场景
    let scene = new THREE.Scene()
    // fog
    {
        let color = 'lightblue'
        let near = 1
        let far = 2
        scene.fog = new THREE.Fog(color, near, far)
        scene.background = new THREE.Color(color)

        let fogGUIHelper = new FogGUIHelper(scene.fog)
        gui.add(fogGUIHelper, 'near', near, far).listen()
        gui.add(fogGUIHelper, 'far', near, far).listen()
        gui.addColor(fogGUIHelper, 'color')
    }

    // FogExp2
    // {
    //     let color = 0xFFFFFF
    //     let density = 0.1
    //     scene.fog = new THREE.FogExp2(color, density)
    //     scene.background = new THREE.Color('#F00')
    // }

    // 几何体
    let boxWidth = 1
    let boxHeight = 1
    let boxDepth = 1
    let geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

    // 材质
    // let material = new THREE.MeshBasicMaterial({color: 0x44aa88})
    let material = new THREE.MeshPhongMaterial({color: 0x44aa88})

    // 网格
    // let cube = new THREE.Mesh(geometry, material)
    // scene.add(cube)

    // 灯光
    {
        let color = 0xFFFFFF
        let intensity = 3
        let light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-1, 2, 4)
        scene.add(light)
    }

    // 多个网格
    function makeInstance(geometry: any, color: any, x: any) {
        let material = new THREE.MeshPhongMaterial({color})
        let cube = new THREE.Mesh(geometry, material)

        scene.add(cube)
        cube.position.x = x
        return cube
    }
    let cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2)
    ]

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
        cubes.forEach((cube, ndx) => {
            let speed = 1 + ndx * .1;
            let rot = time * speed;
            cube.rotation.x = rot
            cube.rotation.y = rot
        })

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