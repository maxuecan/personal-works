<!-- 图元 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
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
    let fov = 40
    let aspect = 2 // canvas默认
    let near = 0.1
    let far = 1000
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 120

    // 场景
    let scene = new THREE.Scene()
    scene.background = new THREE.Color(0xaaaaaa)

    // 图元新增
    let objects = []
    let spread = 15
    function addObject(x: number, y: number, obj: object) {
        obj.position.x = x * spread
        obj.position.y = y * spread

        scene.add(obj)
        objects.push(obj)
    }
    // 创建材质
    function createMaterial() {
        let material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide
        })
        
        let hue = Math.random()
        let saturation = 1
        let luminance = .5
        material.color.setHSL(hue, saturation, luminance)

        return material
    }
    // 创建随机颜色的材质
    function addSolidGeometry(x: number, y: number, geometry) {
        let mesh = new THREE.Mesh(geometry, createMaterial())
        addObject(x, y, mesh)
    }

    {
        let width = 8
        let height = 8
        let depth = 8
        addSolidGeometry(-2, 2, new THREE.BoxGeometry(width, height, depth))
    }

    // 文字
    {
        let loader = new FontLoader()
        // 将字体加载过程promise化
        function loadFont(url) {
            return new Promise((resolve, reject) => {
                loader.load(url, resolve, undefined, reject)
            })
        }

        async function doit() {
            let font = await loadFont('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json')
            let geometry = new TextGeometry('three.js', {
                font: font,
                size: 3.0,
                height: .2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.15,
                bevelSize: .3,
                bevelSegments: 5,
            })
            let mesh = new THREE.Mesh(geometry, createMaterial())
            geometry.computeBoundingBox()
            geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1)

            let parent = new THREE.Object3D()
            parent.add(mesh)

            addObject(-1, -1, parent)
        }
        doit()
    }

    {
        const radius = 7;
        const widthSegments = 12;
        const heightSegments = 8;
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.PointsMaterial({
            color: 'red',
            size: 0.2,     // in world units
        });
        const points = new THREE.Points(geometry, material);
        scene.add(points);
    }

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