<!-- 28，加载OBJ文件.vue -->
<!-- https://free3d.com/zh/3d-model/low-poly-car-92833.html -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
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
    let fov = 45
    let aspect = 2
    let near = 0.1
    let far = 100
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 10, 20)

    // 控制器
    let controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 6, 0)
    controls.update()

    // 场景
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('black')

    {
        const planeSize = 40

        const loader = new THREE.TextureLoader()
        const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        const repeats = planeSize / 2
        texture.repeat.set(repeats, repeats)

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh(planeGeo, planeMat)
        mesh.rotation.x = Math.PI * - .5
        scene.add(mesh)
    }

    {
        const skyColor = 0xB1E1FF
        const groundColor = 0xB97A20
        const intensity = 3
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity )
        scene.add(light)
    }

    {
        const color = 0xFFFFFF
        const intensity = 3
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(0, 10, 0)
        light.target.position.set(5, 10, 2)
        scene.add(light)
        scene.add(light.target)
    }

    // let mtl = new URL('../source/windmill_001.mtl', import.meta.url).href
    // let source = new URL('../source/windmill_001.obj', import.meta.url).href
    // https://threejs.org/manual/examples/resources/models/windmill/windmill.mtl
    // https://threejs.org/manual/examples/resources/models/windmill/windmill-fixed.mtl
    {   
        // 风车
        // const mtlLoader = new MTLLoader()
        // mtlLoader.load('https://threejs.org/manual/examples/resources/models/windmill/windmill-fixed.mtl', (mtls: any) => {
        //     mtls.preload()

        //     const objLoader = new OBJLoader()
        //     mtls.materials.Material.side = THREE.DoubleSide
        //     objLoader.setMaterials(mtls)
        //     objLoader.load('https://threejs.org/manual/examples/resources/models/windmill/windmill.obj', (root: any) => {
        //         scene.add(root)
        //     })
        // })

        // 汽车
        const mtl_s = new URL('../source/Car/Car/Car_Obj.mtl', import.meta.url).href
        const car_s = new URL('../source/Car/Car/Car Obj.obj', import.meta.url).href

        const mtlLoader = new MTLLoader()
        mtlLoader.load(mtl_s, (mtl: any) => {
            mtl.preload()

            const objLoader = new OBJLoader()
            objLoader.setMaterials(mtl)
            objLoader.load(car_s, (root: any) => {
                scene.add(root)
            })
        })
    }

    function resizeRendererToDisplaySize(renderer: { domElement: any; setSize: (arg0: any, arg1: any, arg2: boolean) => void }) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if ( needResize ) {
            renderer.setSize( width, height, false );
        }

        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        renderer.render(scene, camera)
        requestAnimationFrame( render )
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