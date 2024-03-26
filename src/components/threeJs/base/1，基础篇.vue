<!-- 基础篇 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
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

    // 相机
    let fov = 75
    let aspect = 2
    let near = 0.1
    let far = 5
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2

    // 场景
    let scene = new THREE.Scene()

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


    function render(time: number) {
        time *= 0.001; // 将事件单位变为秒

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