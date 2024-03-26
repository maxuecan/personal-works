<!-- 两台摄像机 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
        <div class="split">
            <div id="view1" tabindex="1"></div>
            <div id="view2" tabindex="2"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { getCurrentInstance, onMounted, nextTick, ref, reactive } from 'vue'

let { ctx } = getCurrentInstance() as any

onMounted(async () => {
    await nextTick()
    main()
})

function main() {
    let canvas = ctx.$refs.threeBox
    let view1Elem = document.querySelector('#view1')
    let view2Elem = document.querySelector('#view2')
    // 渲染器
    let renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas
    })

    // 相机
    let fov = 45
    let aspect = 2
    let near = 5
    let far = 100
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 10, 20)

    let cameraHelper = new THREE.CameraHelper(camera)

    class MinMaxGUIHelper {
        constructor(obj:Object, minProp:Number, maxProp:Number, minDif:Number) {
            this.obj = obj
            this.minProp = minProp
            this.maxProp = maxProp
            this.minDif = minDif
        }
        get min() {
            return this.obj[this.minProp]
        }
        set min(v) {
            this.obj[this.minProp] = v
            this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif)
        }
        get max() {
            return this.obj[this.maxProp]
        }
        set max(v) {
            this.obj[this.maxProp] = v
            this.min = this.min
        }
    }

    function updateCamera() {
        camera.updateProjectionMatrix()
    }

    const gui = new GUI()
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera)
    const minmaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
    gui.add(minmaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera)
    gui.add(minmaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera)

    // 控制器
    let controls = new OrbitControls(camera, view1Elem)
    controls.target.set(0, 5, 0)
    controls.update()

    // 第二台相机
    let camera2 = new THREE.PerspectiveCamera(
        60,
        2,
        0.1,
        500
    )
    camera2.position.set(40, 10, 30)
    camera2.lookAt(0, 5, 0)

    let controls2 = new OrbitControls(camera2, view2Elem)
    controls2.target.set(0, 5, 0)
    controls2.update() 

    // 场景
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('black')
    scene.add(cameraHelper)

    // 平面
    {
        let planeSize = 40
        
        let loader = new THREE.TextureLoader()
        let texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        texture.colorSpace = THREE.SRGBColorSpace
        let repeats = planeSize / 2
        texture.repeat.set(repeats, repeats)

        // 平面几何体/材质/网格
        let planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
        let planeMat = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide
        })
        let mesh = new THREE.Mesh(planeGeo, planeMat)
        mesh.rotation.x = Math.PI * -.5
        scene.add(mesh)
    }

    // 立方体
    {
        let cubeSize = 4
        let cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        let cubeMat = new THREE.MeshStandardMaterial({color: '#8AC'})
        let mesh = new THREE.Mesh(cubeGeo, cubeMat)
        mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
        scene.add(mesh)
    }

    // 球体几何体/材质/网格
    {
        let sphereRadius = 3
        let sphereWidthDivsions = 32
        let sphereHeightDivisions = 16
        let sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivsions, sphereHeightDivisions)
        let sphereMat = new THREE.MeshStandardMaterial({color: '#CA8'})
        let mesh = new THREE.Mesh(sphereGeo, sphereMat)
        mesh.position.set(- sphereRadius - 1, sphereRadius + 2, 0)
        scene.add(mesh)
    }

    // 灯光
    {
        const color = 0xFFFFFF
        let intensity = 3
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(0, 10, 0)
        light.target.position.set(-5, 0, 0)
        scene.add(light)
        scene.add(light.target)
    }

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

    function setScissorForElement(elem) {
        let canvasRect = canvas.getBoundingClientRect()
        let elemRect = elem.getBoundingClientRect()
        // 计算canvas的尺寸
        let right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
        let left = Math.max(0, elemRect.left - canvasRect.left)
        let bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
        let top = Math.max(0, elemRect.top - canvasRect.top)

        let width = Math.min(canvasRect.width, right - left)
        let height = Math.min(canvasRect.height, bottom - top)
        // 设置剪函数以仅渲染一部分场景
        let positiveYUpBottom = canvasRect.height - bottom
        renderer.setScissor(left, positiveYUpBottom, width, height)
        renderer.setViewport(left, positiveYUpBottom, width, height)
        // 返回aspect
        return width / height
    }

    function render(time: number) {
        resizeRendererToDisplaySize(renderer)
        // 启用剪刀函数
        renderer.setScissorTest(true)
        // 渲染主视野
        {
            let aspect = setScissorForElement(view1Elem)
            // 用计算出的aspect修改摄像机参数
            camera.aspect= aspect
            camera.updateProjectionMatrix()
            cameraHelper.update()
            // 来原视野中不要绘制cameraHelper
            cameraHelper.visible = false

            scene.background.set(0x000000)
            // 渲染
            renderer.render(scene, camera)
        }
        // 渲染第二台摄像机
        {
            let aspect = setScissorForElement(view2Elem)
            // 调整aspect
            camera2.aspect = aspect
            camera2.updateProjectionMatrix()
            // 在第二台摄像机中绘制cameraHelper
            cameraHelper.visible = true

            scene.background.set(0x000040)

            renderer.render(scene, camera2)
        }

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
.split {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
}
.split>div {
  width: 100%;
  height: 100%;
}
</style>
