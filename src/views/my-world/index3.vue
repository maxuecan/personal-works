<script setup>
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted} from 'vue';

onMounted(() => {
    main()
})

let camera = null,
cameraHelper = null,
controls = null,
scene = null,
light = null,
clock = null,

phoenixMixerArr = [],
phoenixMixer = null,
phoenixAction = null,

box_model = null,
phoneix_model = null,
phoneix_model_action = 'add',
phoneix_model_position = [
    {
        value: 0,
        min: -2,
        max: 2.5
    },
    {
        value: 0,
        min: -2,
        max: 1.5
    },
    {
        value: -0.1,
        min: -0.1,
        max: 1
    },
],
direction = null,
direction_arr = ['top', 'bottom', 'left', 'right', 'before', 'after']

function main() {
    clock = new THREE.Clock();

    const canvas = document.getElementById('my-world')
    // 渲染器
    const renderer = createRenderer(canvas);
    // 相机
    camera = createCamera()
    // 控制器
    controls = createControls(camera, canvas)
    // 场景
    scene = createScene()

    // 盒子模型
    createBox(scene)
    // 凤凰
    setTimeout(() => createPhoenix(scene), 1000)

    // 辅助工具
    const gui = new GUI()
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera)
    const minMaxHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
    gui.add(minMaxHelper, 'min', 0.1, 50, 0.1 ).name( 'near' ).onChange( updateCamera );
	gui.add(minMaxHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( updateCamera );

    // 渲染
    function render(time) {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }
        time += 0.1
        if (phoneix_model) {
            // mathPhoenixPos()
        }

        let dt = clock.getDelta()
        for (let i = 0; i < phoenixMixerArr.length; i++) {
            phoenixMixerArr[i].update(dt)
        }

        requestAnimationFrame(render)
        renderer.render(scene, camera)
    }

    requestAnimationFrame(render)
}

// 创建渲染器 (创建一个渲染器并设置大小，WebGLRenderer将会使用电脑显卡来渲染场景)
function createRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true, // 设置透明度
        logarithmicDepthBuffer: true,
        canvas
    })
    renderer.shadowMap.enabled = true // 激活阴影，允许场景使用阴影贴图
    renderer.setClearColor(0x000000, 0) // 设置背景颜色 默认黑色
    renderer.outputEncoding = THREE.sRGBEncoding // 设置颜色空间
    return renderer
}
/**
 * 创建相机（THREE.Vector3实例化一个三维向量）
 * fov 视角
 * aspect 视宽比
 * near 进
 * far 远
 * */ 
function createCamera(fov = 40, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 1000) {
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    // camera.position.copy(new THREE.Vector3(0, 0, 45)) // copy将属性复制到新相机中
    // camera.lookAt(new THREE.Vector3(0, 0, 0)) // 设置视线方向
    // camera.position.set(0, 10, 20) // 设置相机的位置

    return camera
}
// 创建控制器
function createControls(camera, canvas) {
    let controls = new OrbitControls(camera, canvas)
    controls.enableZoom = false // 是否可以缩放
    controls.enablePan = false // 启用或禁用摄像机平移
    controls.enableRotate = false // 是否启用旋转功能
    controls.update()

    return controls
}
// 创建场景
function createScene() {
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('#000000') // #8ec3ed

    return scene
}
// 创建盒子
async function createBox(scene) {
    const gltf = await loadGLTF('../../assets/person/ship_in_clouds/scene.gltf')
    // gltf.scene.traverse((child) => {
    //     if (child.isMesh) {
    //         // 中心点坐标
    //         const center = new THREE.Vector3();
    //         // 计算模型的中心点
    //         child.geometry.computeBoundingBox();
    //         const boundingBox = child.geometry.boundingBox;
    //         if (boundingBox) {
    //             center.copy(boundingBox.getCenter(center));
    //         }

    //         // 设置模型的位置，使其中心与全局中心点对齐
    //         child.position.sub(center);

    //         // 这里设置你想要的旋转轴和角度
    //         const axis = new THREE.Vector3(0, 1, 0); // Y轴
    //         const angle = 2 * Math.PI; // 一周旋转

    //         // 使用rotateOnAxis旋转模型
    //         child.rotateOnAxis(axis, angle);
        
    //         // 将旋转后的模型中心点恢复到原来的位置
    //         child.position.add(center);
    //     }
    // })

    box_model = gltf.scene
    box_model.rotateY(Math.PI) // 绕y轴旋转90度
    scene.add(box_model)
    // 设置相机位置
    camera.position.set(0, 0, 5)
}
// 创建凤凰
async function createPhoenix(scene) {
    const gltf = await loadGLTF('../../assets/bird/scene.gltf')
    phoneix_model = gltf.scene
    phoneix_model.traverse((o) => {
        // 启用投射和接收阴影的能力
        o.castShadow = true
        o.receiveShadow = true
    })

    phoneix_model.scale.set(0.001, 0.001, 0.001)
    phoneix_model.position.set(0, 0, -0.1)
    scene.add(phoneix_model)

    // 动画数据
    const animations = gltf.animations
    // 创建模型动作混合器
    phoenixMixer = new THREE.AnimationMixer(phoneix_model) 
    phoenixMixerArr.push(phoenixMixer)
    phoenixAction = phoenixMixer.clipAction(animations[0])

    phoenixAction.play()
}
function mathPhoenixPos() {
    if (!direction) {
        let num = getRandom(0, 5)
        direction = num
        phoneix_model_action = direction % 2 === 0 ? 'add' : 'reduce'
    }
    let index = direction / 2 % 2 === 0 ? direction / 2 : direction - 1
    let aspect = camera.aspect.toFixed()
    let value = phoneix_model_position[index].value
    let min = phoneix_model_position[index].min * aspect
    let max = phoneix_model_position[index].max * aspect
    let n_v = 0
    if (phoneix_model_action === 'add') {
        if ((value + 0.1 >= max)) {
            phoneix_model_action = 'reduce'
            n_v = value - 0.01
            phoneix_model.rotation.y = Math.PI
        } else {
            n_v = value + 0.01
        }
    } else if (phoneix_model_action === 'reduce') {
        if (value - 0.1 <= min) {
            phoneix_model_action = 'add'
            direction = null
            n_v = value + 0.01
            // phoneix_model.rotation.y = Math.PI * 2
        } else {
            n_v = value - 0.01
        }
    }
    phoneix_model_position[index].value = n_v
    // = {
    //     value,
    //     min: phoneix_model_position[index].min,
    //     max: phoneix_model_position[index].max,
    // }
    console.log(['x', 'y', 'z'][index])
    phoneix_model.position[['x', 'y', 'z'][index]] = n_v
}
function getRandom(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// 加载gltf模型
function loadGLTF(url) {
    const _texture = new URL(url, import.meta.url).href
    let loader = new GLTFLoader()
    loader.setDRACOLoader(new DRACOLoader())
    return new Promise((resolve, reject) => {
        loader.load(_texture, (gltf) => {
            resolve(gltf)
        })
    })
}

// 适配
function resizeRendererToDisplaySize(renderer) {
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
function updateCamera() {
    camera.updateProjectionMatrix();
}
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
</script>

<template>
    <div class="container">
        <canvas id="my-world"></canvas>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
}
#my-world {
    width: 100%;
    height: 100%;
    display: block;
}
</style>