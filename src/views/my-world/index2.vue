<template>
    <div class="container">
        <canvas id="my-world" ref="myWorld"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import {
    templateVertexShader,
    templateFragmentShader,
    sunNoiseVertexShader,
    sunNoiseFragmentShader,
    sunShapeVertexShader,
    sunShapeFragmentShader,
    sunRingVertexShader,
    sunRingFragmentShader,
} from './texture'

import { getCurrentInstance, onMounted, nextTick } from 'vue';

let { ctx } = getCurrentInstance() as any
onMounted(async () => {
    await nextTick()
    main()
})

let camera: THREE.Camera;
let controls: OrbitControls;
let tween: any;

function main() {
    let clock = new THREE.Clock();
    let tween;

    const position = new THREE.Vector3(-20, 15, -15)
    const canvas = ctx.$refs.myWorld;
    // 渲染器
    const renderer = createRenderer(canvas);
    // 相机
    camera = createCamera()
    // 控制器
    controls = createControls(camera, canvas)
    // 场景
    let scene = createScene()

    // 添加天空盒
    // createSky(scene)

    // 创建地板
    let meterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    })
    let PlaneGeometry = new THREE.PlaneGeometry(50, 50)
    let plane = new THREE.Mesh(PlaneGeometry, meterial)
    plane.position.set(0, -1, 0)
    plane.rotation.x = -Math.PI/2
    plane.receiveShadow = true
    scene.add(plane)

    // 创建球体模拟灯光
    // let SphereGemoetry = new THREE.SphereGeometry(1, 20, 20)
    // let sphere = new THREE.Mesh(SphereGemoetry, meterial)
    // sphere.castShadow = true
    // scene.add(sphere)

    // function createGrid() {
    //     let grid = new THREE.GridHelper(200, 400, 0xffffff, 0xffffff)
    //     grid.material.opacity = 0.2
    //     grid.material.depthWrite = false
    //     grid.material.transparent = true
    //     grid.receiveShadow = true
    //     return grid
    // }
    // scene.add(createGrid())

    // 创建噪声网格
    const sunNoiseMaterial = new THREE.ShaderMaterial({
        vertexShader: sunNoiseVertexShader,
        fragmentShader: sunNoiseFragmentShader,
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0
            },
            uMouse: {
                value: new THREE.Vector2(0, 0)
            },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
        }
    });
    const sunNoiseMesh = createSunNoiseMesh(sunNoiseMaterial)
    sunNoiseMesh.position.copy(new THREE.Vector3(0, 0, 0))

    // 创建立方体离屏渲染目标，将其作为太阳本体的噪声贴图
    const cubeRt = new THREE.WebGLCubeRenderTarget(256)
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRt)
    const cubeScene = new THREE.Scene()
    cubeScene.add(sunNoiseMesh)

    // 创建太阳本体网格
    const sunShapeMaterial = new THREE.ShaderMaterial({
        vertexShader: sunShapeVertexShader,
        fragmentShader: sunShapeFragmentShader,
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0
            },
            uMouse: {
                value: new THREE.Vector2(0, 0)
            },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            },
            uNoiseTexture: {
                value: null
            },
            uVelocity: {
                value: 0.05
            },
            uBrightness: {
                value: 0.33
            },
            uStagger: {
                value: 16
            }
        }
    });
    const sunShapeMesh = createSunShapeMesh(sunShapeMaterial)
    sunShapeMesh.position.copy(position)
    // 给太阳本体创建光源
    createSunShapeLight(sunShapeMesh)
    scene.add(sunShapeMesh)

    let smallBall = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 20, 20),
        new THREE.MeshBasicMaterial({color: 0xff0000})
    )
    smallBall.position.set(0, 10, 0)
    scene.add(smallBall)

    // 创建太阳环网格
    const sunRingMaterial = new THREE.ShaderMaterial({
        vertexShader: sunRingVertexShader,
        fragmentShader: sunRingFragmentShader,
        side: THREE.BackSide,
        uniforms: {
            uTime: {
                value: 0
            },
            uMouse: {
                value: new THREE.Vector2(0, 0)
            },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
        }
    });
    const sunRingMesh = createSunRingMesh(sunRingMaterial)
    sunRingMesh.position.copy(position)
    scene.add(sunRingMesh)

    // 创建云朵
    createCloud(scene)

    // 创建人物
    let minxerArr: string | any[] = []
    createPeople(scene, minxerArr)

    // 渲染
    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        let dt = clock.getDelta()
        for (let i = 0; i < minxerArr.length; i++) {
            minxerArr[i].update(dt)
        }

        TWEEN.update()

        let elapsedTime = clock.getElapsedTime()
        let mousePos = new THREE.Vector2(0, 0)
        cubeCamera.update(renderer, cubeScene)
        if (sunNoiseMaterial && sunShapeMaterial) {
            sunNoiseMaterial.uniforms.uTime.value = elapsedTime;
            sunNoiseMaterial.uniforms.uMouse.value = mousePos;
            sunShapeMaterial.uniforms.uTime.value = elapsedTime;
            sunShapeMaterial.uniforms.uMouse.value = mousePos;
            sunShapeMaterial.uniforms.uNoiseTexture.value = cubeRt.texture;
            sunRingMaterial.uniforms.uTime.value = elapsedTime;
            sunRingMaterial.uniforms.uMouse.value = mousePos;
        }

        requestAnimationFrame(render)
        renderer.render(scene, camera)
    }

    // 监听单机拾取对象初始化球体
    document.addEventListener('click', pickupObjects, false)

    requestAnimationFrame(render)
}

// 渲染器 (创建一个渲染器并设置大小，WebGLRenderer将会使用电脑显卡来渲染场景)
function createRenderer(canvas: any) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true,
        canvas
    })
    renderer.shadowMap.enabled = true // 激活阴影，允许场景使用阴影贴图
    // renderer.outputEncoding = THREE.LinearEncoding // outputEncoding属性控制输出渲染编码
    // renderer.setPixelRatio(window.devicePixelRatio) // 设置设备像素比 通常用于避免HiDPI设备上绘图模糊
    // renderer.setSize(window.innerWidth, window.innerHeight) // 将输出canvas的大小调整为(width, height)并考虑设备像素比，且将视口从(0, 0)开始调整到适合大小 将updateStyle设置为false以阻止对canvas的样式做任何改变
    renderer.setClearColor(0x000000, 0) // 设置背景颜色 默认黑色

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
    camera.position.copy(new THREE.Vector3(0, 10, 50)) // copy将属性复制到新相机中
    camera.lookAt(new THREE.Vector3(0, 0, 0)) // 设置视线方向
    // camera.position.set(0, 10, 20) // 设置相机的位置

    return camera
}

// 创建控制器
function createControls(camera: any, canvas: any) {
    let controls = new OrbitControls(camera, canvas)
    // controls.enableZoom = false // 是否可以缩放
    // controls.enablePan = false // 启用或禁用摄像机平移
    // controls.enableRotate = false // 是否启用旋转功能
    // controls.minPolarAngle = Math.PI / 3 // 上下两极的可视区域最小角度
    // controls.maxPolarAngle = Math.PI / 2.05 // 上下两极的可视区域的最大角度

    // controls.target = new THREE.Vector3(0, 1, 0) // 设置目标
    // controls.object.position.set(0, 2, -4)
    controls.target.copy(new THREE.Vector3(0, 0, 0))
    controls.update()

    return controls
}

// 创建场景
function createScene() {
    // 场景纹理图
    let _texture = new URL('../../assets/texture/venice_sunset_1k.hdr', import.meta.url).href
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('#000000')
    scene.environment = new RGBELoader().load(_texture) // 控制场景的渲染方式
    scene.environment.mapping = THREE.EquirectangularReflectionMapping // 环境贴图的映射方式
    // scene.fog = new THREE.Fog(0x333333, 10, 15) // 雾化效果

    return scene
}

// 创建噪声网格
function createSunNoiseMesh(sunNoiseMaterial: any) {
    const sunNoiseGeometry = new THREE.SphereBufferGeometry(1, 100, 100);
    return new THREE.Mesh(sunNoiseGeometry, sunNoiseMaterial)
}

// 创建太阳本体网格
function createSunShapeMesh(sunShapeMaterial: any) {
    const sunShapeGeometry = new THREE.SphereBufferGeometry(1, 100, 100);
    return new THREE.Mesh(sunShapeGeometry, sunShapeMaterial)
}

// 创建太阳本体光源
function createSunShapeLight(mesh: any) {
    // let light = new THREE.DirectionalLight(new THREE.Color('#ffffff'), 0.5)
    // let light = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.4)
    let light = new THREE.PointLight(new THREE.Color('#ffffff'), 1)
    light.castShadow = true
    light.intensity = 1
    mesh.add(light)
}

// 创建太阳环网格
function createSunRingMesh(sunRingMaterial: any) {
    const sunRingGeometry = new THREE.SphereBufferGeometry(1.2, 100, 100);

    return new THREE.Mesh(sunRingGeometry, sunRingMaterial)
}

// 创建云层
function createCloud(scene: THREE.Scene) {
    // 纹理图
    let cloud_num = 15
    let clouds = new THREE.Group()
    let sprites = [
        new THREE.TextureLoader().load(new URL('../../assets/threejs/cloud.png', import.meta.url).href),
        new THREE.TextureLoader().load(new URL('../../assets/threejs/cloud2.png', import.meta.url).href),
        new THREE.TextureLoader().load(new URL('../../assets/threejs/cloud3.png', import.meta.url).href),
        new THREE.TextureLoader().load(new URL('../../assets/threejs/cloud4.png', import.meta.url).href)
    ]
    let x = 1
    for (let i = 0; i < cloud_num; i++) {
        for (let j = 0; j < 4; j++) {
            let cloud = new THREE.Sprite(new THREE.SpriteMaterial({
                map: sprites[j],
                transparent: true,
                opacity: 0.5
            }))
            cloud.position.set(
                (Math.random() * 2 - 1)  * (x + Math.random() * 10),
                (10 + Math.random() * (10/5)),
                (Math.random() * 2 - 1) * (3 + Math.random() * 10)
            )
            cloud.scale.set(5, 5, 5)
            x += 0.2
            clouds.add(cloud)
        }
    }
    scene.add(clouds)
}

// 创建天空盒
function createSky(scene: THREE.Scene) {
    let _texture = new URL('../../assets/threejs/sky.png', import.meta.url).href
    let loader = new THREE.TextureLoader()
    let bg_texture = loader.load(_texture)
    bg_texture.colorSpace = THREE.SRGBColorSpace
    scene.background = bg_texture
}

// 创建人物
type T = any
let peopleObj: THREE.Object3D<THREE.Object3DEventMap> | THREE.AnimationObjectGroup, 
    peopleAnimations: any[], 
    activeAction: THREE.AnimationAction, 
    mixer: THREE.AnimationMixer;
function createPeople(scene: any, minxerArr: Array<T>) {
    const gltf_peo = new URL('../../components/threeJs/source/people1/people.glb', import.meta.url).href
    let gloader = new GLTFLoader()
    gloader.load(gltf_peo, result => {
        peopleObj = result.scene
        peopleObj.castShadow = true
        // peopleObj.scale.set(0.7, 0.7, 0.7)
        peopleAnimations = result.animations

        scene.add(peopleObj)

        // 默认人物站立动画
        mixer = new THREE.AnimationMixer(peopleObj)
        minxerArr.push(mixer)
        activeAction = mixer.clipAction(peopleAnimations[0])
        activeAction.play()
    })
}

// 拾取对象
function pickupObjects(e: any) {
    // 点击屏幕创建一个向量
    let raycaster = new THREE.Raycaster()
    let vector = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
    )
    let fxl = new THREE.Vector3(0, 1, 0)
    let groundplane = new THREE.Plane(fxl, 0)
    raycaster.setFromCamera(vector, camera)

    let intersects = raycaster.ray.intersectPlane(groundplane, fxl)

    if (!intersects) return

    // 人物当前位置
    let originPosition = new THREE.Vector3(
        peopleObj.position.x,
        0,
        peopleObj.position.z
    )
    // 人物目标位置
    let targetPosition = new THREE.Vector3(
        intersects.x,
        0,
        intersects.z
    )

    // 移动位置
    let distance = originPosition.distanceTo(targetPosition)

    peopleObj.lookAt(intersects.x, 0, intersects.z)
    // 在传入的时间间隔内，逐渐将此动作的权重（weight）由1降至0
    // 判断当前人物是否空闲状态，如果空前则改成步行状态
    if (activeAction.getClip() != peopleAnimations[1]) {
        activeAction.fadeOut(0.2)
        activeAction = mixer.clipAction(peopleAnimations[1])
        activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(2)
            .fadeIn(0.2)
            .play();
    }

    if (tween) {
        TWEEN.remove(tween)
    }
    tween = new TWEEN.Tween(originPosition)
        .to(targetPosition, distance * 800)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(function() {
            activeAction.fadeOut(0.2);
            activeAction = mixer.clipAction(peopleAnimations[0]);
            activeAction
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(2)
                .fadeIn(0.2)
                .play();
		})
        .onUpdate(function() {
            peopleObj.position.set(this._object.x, 0.04, this._object.z);

            let pos = peopleObj.position.clone();
            pos.y = 1;
            controls.target = pos;
            controls.update();
		})
		.start();

}

// 适配
function resizeRendererToDisplaySize(renderer: { domElement: any; setSize: (arg0: any, arg1: any, arg2: boolean) => void; }) {
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

</script>

<style scoped lang="scss">
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
