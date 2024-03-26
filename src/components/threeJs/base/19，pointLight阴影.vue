<!-- 19，pointLight阴影 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
    renderer.shadowMap.enabled = true

    // 摄像头
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

    // 纹理
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

        // 几何体
        let planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
        // 材质
        let planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        })
        // 网格
        let mesh = new THREE.Mesh(planeGeo, planeMat)
        mesh.receiveShadow = true
        mesh.rotation.x = Math.PI * - .5
        scene.add(mesh)
    }

    // 立方体
    {
        let cubeSize = 4
        let cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        let cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'})
        let mesh = new THREE.Mesh(cubeGeo, cubeMat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
        scene.add(mesh)
    }

    {
        let cubeSize = 30
        let cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        let cubeMat = new THREE.MeshPhongMaterial({
            color: '#CCC',
            side: THREE.BackSide
        })
        let mesh = new THREE.Mesh(cubeGeo, cubeMat)
        mesh.receiveShadow = true
        mesh.position.set(0, cubeSize / 2 - 0.1, 0)
        scene.add(mesh)
    }

    // 球
    {
        let sphereRadius = 3
        let sphereWidthDivisions = 32
        let sphereHeightDivisions = 16
        let sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
        let sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'})
        let mesh = new THREE.Mesh(sphereGeo, sphereMat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
        scene.add(mesh)
    }

    // 辅助函数
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

    function makeXYZGUI(gui, vector3, name, onChangeFn) {
        let folder = gui.addFolder(name)
        folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
        folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
        // folder.open()
    }

    // 方向光源
    // {
    //     let color = 0xFFFFFF
    //     let intensity = 3
    //     let light = new THREE.DirectionalLight(color, intensity)
    //     light.castShadow = true
    //     light.position.set(0, 10, 0)
    //     light.target.position.set(-4, 0, -4)
    //     scene.add(light)
    //     scene.add(light.target)

    //     const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
    //     scene.add(cameraHelper)

    //     let helper = new THREE.DirectionalLightHelper(light)
    //     scene.add(helper)

    //     function updateCamera() {
    //         light.target.updateMatrixWorld()
    //         helper.update()

    //         light.shadow.camera.updateProjectionMatrix()
    //         cameraHelper.update()
    //     }

    //     updateCamera()

    //     class DimensionGUIHelper {
    //         constructor(obj, minProp, maxProp) {
    //             this.obj = obj
    //             this.minProp = minProp
    //             this.maxProp = maxProp
    //         }
    //         get value() {
    //             return this.obj[this.maxProp] * 2
    //         }
    //         set value(v) {
    //             this.obj[this.maxProp] = v / 2
    //             this.obj[this.minProp] = v / -2
    //         }
    //     }

    //     class MinMaxGUIHelper {
    //         constructor(obj, minProp, maxProp, minDif) {
    //             this.obj = obj
    //             this.minProp = minProp
    //             this.maxProp = maxProp
    //             this.minDif = minDif
    //         }
    //         get min() {
    //             return this.obj[this.minProp]
    //         }
    //         set min(v) {
    //             this.obj[this.minProp] = v
    //             this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif)
    //         }
    //         get max() {
    //             return this.obj[this.maxProp]
    //         }
    //         set max(v) {
    //             this.obj[this.maxProp] = v
    //             this.min = this.min
    //         }
    //     }

    //     let gui = new GUI()
    //     gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    //     gui.add(light, 'intensity', 0, 10, 0.01)
    //     {
    //         let folder = gui.addFolder('Shadow Camera')
    //         folder.open()
    //         folder.add(new DimensionGUIHelper(light.shadow.camera, 'left', 'right'), 'value', 1, 100)
    //             .name('width')
    //             .onChange(updateCamera)
    //         folder.add(new DimensionGUIHelper(light.shadow.camera, 'bottom', 'top'), 'value', 1, 100)
    //             .name('height')
    //             .onChange(updateCamera)
    //         let minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1)
    //         folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera)
    //         folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera)
    //         folder.add(light.shadow.camera, 'zoom', 0.01, 1.5, 0.01).onChange(updateCamera)
    //     }

    //     makeXYZGUI(gui, light.position, 'position', updateCamera)
    //     makeXYZGUI(gui, light.target.position, 'target', updateCamera)
    // }

    // 聚灯光
    // {
    //     let color = 0xFFFFFF
    //     let intensity = 100
    //     let light = new THREE.SpotLight(color, intensity)
    //     light.castShadow = true
    //     light.position.set(0, 10, 0)
    //     light.target.position.set(-4, 0, -4)
    //     scene.add(light)
    //     scene.add(light.target)

    //     let cameraHelper = new THREE.CameraHelper(light.shadow.camera)
    //     scene.add(cameraHelper)

    //     function updateCamera() {
    //         light.target.updateMatrixWorld()
    //         light.shadow.camera.updateProjectionMatrix()
    //         cameraHelper.update()
    //     }

    //     updateCamera()
    //     setTimeout(updateCamera)

    //     class MinMaxGUIHelper {
    //         constructor(obj, minProp, maxProp, minDif) {
    //             this.obj = obj
    //             this.minProp = minProp
    //             this.maxProp = maxProp
    //             this.minDif = minDif
    //         }
    //         get min() {
    //             return this.obj[this.minProp]
    //         }
    //         set min(v) {
    //             this.obj[this.minProp] = v
    //             this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif)
    //         }
    //         get max() {
    //             return this.obj[this.maxProp]
    //         }
    //         set max(v) {
    //             this.obj[this.maxProp] = v
    //             this.min = this.min
    //         }
    //     }

    //     class DegRadHelper {
    //         constructor(obj, prop) {
    //             this.obj = obj
    //             this.prop = prop
    //         }
    //         get value() {
    //             return THREE.MathUtils.radToDeg(this.obj[this.prop])
    //         }
    //         set value(v) {
    //             this.obj[this.prop] = THREE.MathUtils.degToRad(v)
    //         }
    //     }

    //     let gui = new GUI()
    //     gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    //     gui.add(light, 'intensity', 0, 200)
    //     gui.add(light, 'distance', 0, 40).onChange(updateCamera)
    //     gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateCamera)
    //     gui.add(light, 'penumbra', 0, 1, 0.01)

    //     {
    //         let folder = gui.addFolder('Shadow Camera')
    //         folder.open()
    //         let minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1)
    //         folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera)
    //         folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera)
    //     }

    //     makeXYZGUI(gui, light.position, 'position', updateCamera)
    //     makeXYZGUI(gui, light.target.position, 'target', updateCamera)
    // }

    // spotlight
    {
        let color = 0xFFFFFF
        let intensity = 20
        let distance = 20
        let light = new THREE.PointLight(color, intensity, distance)
        light.castShadow = true
        light.position.set(0, 10, 0)
        scene.add(light)

        let helper = new THREE.PointLightHelper(light)
        scene.add(helper)

        function updateCamera() {}

        class MinMaxGUIHelper {
            constructor(obj, minProp, maxProp, minDif) {
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

        let gui = new GUI()
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
        gui.add(light, 'intensity', 0, 200)
        gui.add(light, 'distance', 0, 40).onChange(updateCamera)

        {
            let folder = gui.addFolder('Shadow Camera')
            folder.open()
            let minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1)
            folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera)
            folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera)
        }

        makeXYZGUI(gui, light.position, 'position', updateCamera)
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
        resizeRendererToDisplaySize(renderer)

        {
            let canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

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
