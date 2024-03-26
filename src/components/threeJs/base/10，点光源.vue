<!-- 点光源 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
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
    controls.target.set(0, 5, 0)
    controls.update()

    // 场景
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('black')
    
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
        let planeMat = new THREE.MeshPhongMaterial({
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
        let cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'})
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
        let sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'})
        let mesh = new THREE.Mesh(sphereGeo, sphereMat)
        mesh.position.set(- sphereRadius - 1, sphereRadius + 2, 0)
        scene.add(mesh)
    }

    // 颜色辅助工具
    class ColorGUIHelper {
        constructor(object, prop) {
            this.object = object
            this.prop = prop
        }
        get value() {
            return `#${this.object[this.prop].getHexString()}`
        }
        set value(hexString) {
            this.object[this.prop].set(hexString)
        }
    }

    // 辅助线
    function makeXYZGUI(gui, vector3, name, onChangeFn) {
        const folder = gui.addFolder(name)
        folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
        folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
        folder.open()
    }

    // 灯光
    {
        const color = 0xFFFFFF
        let intensity = 1
        let light = new THREE.DirectionalLight(color, intensity)
        light.position.set(0, 10, 0)
        light.target.position.set(-5, 0, 0)
        scene.add(light)
        scene.add(light.target)

        const helper = new THREE.DirectionalLightHelper(light)
        scene.add(helper)

        function updateLight() {
            light.target.updateMatrixWorld()
            helper.update()
        }

        updateLight()

        let gui = new GUI()
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
        gui.add(light, 'intensity', 0, 5, 0.01)

        makeXYZGUI(gui, light.position, 'position', updateLight)
        makeXYZGUI(gui, light.target.position, 'target', updateLight)
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

    function render(time: number) {
        // 响应式
        if (resizeRendererToDisplaySize(renderer)) {
            let canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

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
