<!-- 纹理 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
        <div id="loading">
            <div class="progress">
                <div class="progressbar"></div>
            </div>
        </div>
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

    let cubes = []

    // 创建纹理
    // const loader = new THREE.TextureLoader()
    // let texture = loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg')
    // texture.colorSpace = THREE.SRGBColorSpace
    // 等待一个纹理加载
    // loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg', (texture) => {
    //     let material = new THREE.MeshBasicMaterial({
    //         map: texture
    //     })
    //     let cube = new THREE.Mesh(geometry, material)
    //     scene.add(cube)
    //     cubes.push(cube) // 添加到我们要旋转的立方体数组中
    // })
    // 等待多个纹理加载
    let loadManager = new THREE.LoadingManager()
    let loader = new THREE.TextureLoader(loadManager)
    let materials = [
        new THREE.MeshBasicMaterial( { map: loader.load( 'https://threejs.org/manual/examples/resources/images/flower-1.jpg' ) } ),
        new THREE.MeshBasicMaterial( { map: loader.load( 'https://threejs.org/manual/examples/resources/images/flower-2.jpg' ) } ),
        new THREE.MeshBasicMaterial( { map: loader.load( 'https://threejs.org/manual/examples/resources/images/flower-3.jpg' ) } ),
        new THREE.MeshBasicMaterial( { map: loader.load( 'https://threejs.org/manual/examples/resources/images/flower-4.jpg' ) } ),
        new THREE.MeshBasicMaterial( { map: loader.load( 'https://threejs.org/manual/examples/resources/images/flower-5.jpg' ) } ),
        new THREE.MeshBasicMaterial( { map: loader.load( 'https://threejs.org/manual/examples/resources/images/flower-6.jpg' ) } ),
    ]

    let loadingElem = document.querySelector('#loading')
    let progressBarElem = loadingElem?.querySelector('.progressbar')
    // 加载回调
    loadManager.onLoad = () => {
        loadingElem.style.display = 'none'
        const cube = new THREE.Mesh(geometry, materials)
        scene.add(cube)
        cubes.push(cube)
    }
    // 进度回调
    loadManager.onProgress = (urlOfLastItemloaded, itemsLoaded, itemsTotal) => {
        let progress = itemsLoaded / itemsTotal
        progressBarElem.style.transform = `scaleX(${progress})`
    }

    // 材质
    // let material = new THREE.MeshBasicMaterial({map: texture})
    // 6种材质
    // let materials = [
    //     new THREE.MeshBasicMaterial( { map: loadColorTexture( 'https://threejs.org/manual/examples/resources/images/flower-1.jpg' ) } ),
    //     new THREE.MeshBasicMaterial( { map: loadColorTexture( 'https://threejs.org/manual/examples/resources/images/flower-2.jpg' ) } ),
    //     new THREE.MeshBasicMaterial( { map: loadColorTexture( 'https://threejs.org/manual/examples/resources/images/flower-3.jpg' ) } ),
    //     new THREE.MeshBasicMaterial( { map: loadColorTexture( 'https://threejs.org/manual/examples/resources/images/flower-4.jpg' ) } ),
    //     new THREE.MeshBasicMaterial( { map: loadColorTexture( 'https://threejs.org/manual/examples/resources/images/flower-5.jpg' ) } ),
    //     new THREE.MeshBasicMaterial( { map: loadColorTexture( 'https://threejs.org/manual/examples/resources/images/flower-6.jpg' ) } ),
    // ]

    // 网格
    // let cube = new THREE.Mesh(geometry, materials)
    // scene.add(cube)
    // cubes.push(cube)

    // function loadColorTexture(path) {
    //     let texture = loader.load(path)
    //     texture.colorSpace = THREE.SRGBColorSpace
    //     return texture
    // }

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

        // 多个
        cubes.forEach((cube, ndx) => {
            let speed = .2 + ndx * .1;
            let rot = time * speed;
            cube.rotation.x = rot
            cube.rotation.y = rot
        })

        renderer.render(scene, camera)
        requestAnimationFrame(render)
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
#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#loading .progress {
  margin: 1.5em;
  border: 1px solid white;
  width: 50vw;
}
#loading .progressbar {
  margin: 2px;
  background: white;
  height: 1em;
  transform-origin: top left;
  transform: scaleX(0);
}

</style>
