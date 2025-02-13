<template>
    <div class="container">
        <canvas id="my-world"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import {
    // templateVertexShader,
    // templateFragmentShader,
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
let bodyMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xff0000,
	metalness: 1.0,
	roughness: 0.5,
	clearcoat: 1.0,
	clearcoatRoughness: 0.03
})
// 汽车轮毂的材质，采用了标准网格材质，threejs解析gltf模型，会用两种材质PBR材质去解析
let detailsMaterial = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	metalness: 1.0,
	roughness: 0.5
})
// 汽车玻璃的材质
let glassMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xffffff,
	metalness: 0.25,
	roughness‌: 0,
	transmission: 10
})
/**
 * 汽车模型
 */
// const _car_texture = new URL('../../assets/dream-car/gltf/ferrari_ao.png', import.meta.url).href
// const _car_texture2 = new URL('../../assets/dream-car/gltf/ferrari.glb', import.meta.url).href
// const shadow = new THREE.TextureLoader().load(_car_texture)
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('./draco/gltf/')

function main() {
    let clock = new THREE.Clock();
    let tween;

    const position = new THREE.Vector3(-20, 15, -15)
    // const canvas = ctx.$refs.myWorld2;
    const canvas = document.getElementById('my-world')
    // 渲染器
    const renderer = createRenderer(canvas);
    // 相机
    camera = createCamera()
    // 控制器
    controls = createControls(camera, canvas)
    // 场景
    let scene = createScene()

    // 创建天空盒子
    createSky(scene)
    // 添加天空盒
    // createSky(scene)
    
    // 创建草地
    // createGrass(scene)

    // 创建建筑
    // createBuilding(scene)

    // 创建跑车
    // createDreamCar(scene)

    // 创建地板
    // let meterial = new THREE.MeshPhongMaterial({
    //     color: 0xffffff
    // })
    // let PlaneGeometry = new THREE.PlaneGeometry(50, 50)
    // let plane = new THREE.Mesh(PlaneGeometry, meterial)
    // plane.position.set(0, -1, 0)
    // plane.rotation.x = -Math.PI/2
    // plane.receiveShadow = true
    // scene.add(plane)

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
    // const sunNoiseMaterial = new THREE.ShaderMaterial({
    //     vertexShader: sunNoiseVertexShader,
    //     fragmentShader: sunNoiseFragmentShader,
    //     side: THREE.DoubleSide,
    //     uniforms: {
    //         uTime: {
    //             value: 0
    //         },
    //         uMouse: {
    //             value: new THREE.Vector2(0, 0)
    //         },
    //         uResolution: {
    //             value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    //         }
    //     }
    // });
    // const sunNoiseMesh = createSunNoiseMesh(sunNoiseMaterial)
    // sunNoiseMesh.position.copy(new THREE.Vector3(0, 0, 0))

    // 创建立方体离屏渲染目标，将其作为太阳本体的噪声贴图
    // const cubeRt = new THREE.WebGLCubeRenderTarget(256)
    // const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRt)
    // const cubeScene = new THREE.Scene()
    // cubeScene.add(sunNoiseMesh)

    // 创建太阳本体网格
    // const sunShapeMaterial = new THREE.ShaderMaterial({
    //     vertexShader: sunShapeVertexShader,
    //     fragmentShader: sunShapeFragmentShader,
    //     side: THREE.DoubleSide,
    //     uniforms: {
    //         uTime: {
    //             value: 0
    //         },
    //         uMouse: {
    //             value: new THREE.Vector2(0, 0)
    //         },
    //         uResolution: {
    //             value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    //         },
    //         uNoiseTexture: {
    //             value: null
    //         },
    //         uVelocity: {
    //             value: 0.05
    //         },
    //         uBrightness: {
    //             value: 0.33
    //         },
    //         uStagger: {
    //             value: 16
    //         }
    //     }
    // });
    // const sunShapeMesh = createSunShapeMesh(sunShapeMaterial)
    // sunShapeMesh.position.copy(position)
    // 给太阳本体创建光源
    // createSunShapeLight(sunShapeMesh)
    // scene.add(sunShapeMesh)

    // let smallBall = new THREE.Mesh(
    //     new THREE.SphereGeometry(0.1, 20, 20),
    //     new THREE.MeshBasicMaterial({color: 0xff0000})
    // )
    // smallBall.position.set(0, 10, 0)
    // scene.add(smallBall)

    // 创建太阳环网格
    // const sunRingMaterial = new THREE.ShaderMaterial({
    //     vertexShader: sunRingVertexShader,
    //     fragmentShader: sunRingFragmentShader,
    //     side: THREE.BackSide,
    //     uniforms: {
    //         uTime: {
    //             value: 0
    //         },
    //         uMouse: {
    //             value: new THREE.Vector2(0, 0)
    //         },
    //         uResolution: {
    //             value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    //         }
    //     }
    // });
    // const sunRingMesh = createSunRingMesh(sunRingMaterial)
    // sunRingMesh.position.copy(position)
    // scene.add(sunRingMesh)

    // 创建云朵
    // createCloud(scene)

    // 创建dragon ball
    // createDragonBall(scene)

    // 创建人物
    let minxerArr: string | any[] = []
    // createPeople(scene, minxerArr)

    // createPeople2(scene)

    // 创建鸟
    let bridMinxerArr: string | any[] = []
    // createBird(scene, bridMinxerArr)

    // 创建home_dioroma
    // createHomeDioroma(scene)

    // 渲染
    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        let dt = clock.getDelta()
        // console.log(minxerArr)
        for (let i = 0; i < minxerArr.length; i++) {
            minxerArr[i].update(dt)
        }

        TWEEN.update()


        for (let i = 0; i < bridMinxerArr.length; i++) {
            bridMinxerArr[i].update(dt)
        }

        let elapsedTime = clock.getElapsedTime()
        let mousePos = new THREE.Vector2(0, 0)
        // cubeCamera.update(renderer, cubeScene)
        // if (sunNoiseMaterial && sunShapeMaterial) {
        //     sunNoiseMaterial.uniforms.uTime.value = elapsedTime;
        //     sunNoiseMaterial.uniforms.uMouse.value = mousePos;
        //     sunShapeMaterial.uniforms.uTime.value = elapsedTime;
        //     sunShapeMaterial.uniforms.uMouse.value = mousePos;
        //     sunShapeMaterial.uniforms.uNoiseTexture.value = cubeRt.texture;
        //     sunRingMaterial.uniforms.uTime.value = elapsedTime;
        //     sunRingMaterial.uniforms.uMouse.value = mousePos;
        // }

        requestAnimationFrame(render)
        renderer.render(scene, camera)
    }

    // 监听单机拾取对象初始化球体
    // document.addEventListener('click', pickupObjects, false)

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
    // renderer.outputEncoding = THREE.sRGBEncoding
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
function createCamera(fov = 40, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 10000) {
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.copy(new THREE.Vector3(0, 0, -5)) // copy将属性复制到新相机中
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
    // // 场景纹理图
    // let _texture = new URL('../../assets/texture/venice_sunset_1k.hdr', import.meta.url).href
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('#8ec3ed') // #8ec3ed #000000
    // scene.environment = new RGBELoader().load(_texture) // 控制场景的渲染方式
    // scene.environment.mapping = THREE.EquirectangularReflectionMapping // 环境贴图的映射方式
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
    let cloud_num = 100
    let clouds = new THREE.Group()
    let sprites = [
        new THREE.TextureLoader().load(new URL('../../assets/threejs/cloud.png', import.meta.url).href),
        // new THREE.TextureLoader().load(new URL('../../assets/threejs/cloud2.png', import.meta.url).href),
        // new THREE.TextureLoader().load(new URL('../../assets/threejs/cloud3.png', import.meta.url).href),
        // new THREE.TextureLoader().load(new URL('../../assets/threejs/cloud4.png', import.meta.url).href)
    ]
    let x = 1
    for (let i = 0; i < cloud_num; i++) {
        for (let j = 0; j < 1; j++) {
            let cloud = new THREE.Sprite(new THREE.SpriteMaterial({
                map: sprites[j],
                transparent: true,
                opacity: 1
            }))
            cloud.position.set(
                (Math.random() * 2 - 1)  * (x + Math.random() * 5),
                (Math.random()* 2),
                (Math.random() * 2 - 1) * (3 + Math.random() * 5)
            )
            cloud.scale.set(5, 5, 5)
            x += 0.1
            clouds.add(cloud)
        }
    }
    scene.add(clouds)
}

// 创建天空盒
function createSky(scene: THREE.Scene) {
    // let _texture = new URL('../../assets/threejs/sky.png', import.meta.url).href
    // let loader = new THREE.TextureLoader()
    // let bg_texture = loader.load(_texture)
    // bg_texture.colorSpace = THREE.SRGBColorSpace
    // scene.background = bg_texture

    // let sky = [
    //     new URL('../../components/threeJS/source/sky/posx.jpg', import.meta.url).href,
    //     new URL('../../components/threeJS/source/sky/negx.jpg', import.meta.url).href,
    //     new URL('../../components/threeJS/source/sky/posy.jpg', import.meta.url).href,
    //     new URL('../../components/threeJS/source/sky/negy.jpg', import.meta.url).href,
    //     new URL('../../components/threeJS/source/sky/posz.jpg', import.meta.url).href,
    //     new URL('../../components/threeJS/source/sky/negz.jpg', import.meta.url).href
    // ]
    // let cubeLoader = new THREE.CubeTextureLoader()
    // scene.background = cubeLoader.load(sky)

    // let _texture = new URL('../../assets/person/ship_in_clouds/scene.gltf', import.meta.url).href
    // let loader = new GLTFLoader()
    // loader.setDRACOLoader(new DRACOLoader())
    // loader.load(_texture, (gltf) => {
    //     let _obj = gltf.scene
    //     _obj.traverse((o) => {
    //         // 启用投射和接收阴影的能力
    //         o.castShadow = true
    //         o.receiveShadow = true
    //     })
    //     console.log(gltf)
    //     _obj.scale.set(1, 1, 1)
    //     _obj.position.set(0, 0, 0)
    //     scene.add(_obj)
    //     // let _obj = gltf.scene
    //     // _obj.traverse((o) => {
    //     //     // 启用投射和接收阴影的能力
    //     //     // o.castShadow = true
    //     //     // o.receiveShadow = true
    //     //     // o.material = material
    //     // })
    //     // // _obj.scale.set(0.02, 0.02, 0.02)
    //     // // _obj.rotation.set(0, -Math.PI / 2, 0)
    //     // _obj.position.set(10, 0, -10)
    //     // scene.add(_obj)
    //     // scene.add(gltf.scene)
    // })
}

// 创建草地
function createGrass(scene: THREE.Scene) {
    let _texture = new URL('../../assets/person/grass/scene.gltf', import.meta.url).href
    let loader = new GLTFLoader()
    loader.setDRACOLoader(new DRACOLoader())
    loader.load(_texture, (gltf) => {
        let _obj = gltf.scene
        scene.add(_obj)
    })
    // let _texture = new URL('../../assets/threejs/grass.jpg', import.meta.url).href
    // let loader = new THREE.TextureLoader()
    // loader.load(_texture, (groundTexture) => {
    //     // groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    //     // // groundTexture.repeat.set(repeatX / 5, repeatY / 5)
    //     // groundTexture.anisotropy = 16
    //     // // groundTexture.encoding = THREE.RGBEncoding

    //     // const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture })
    //     // groundMaterial.side = THREE.FrontSide

    //     // const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(width, height), groundMaterial)
    //     // mesh.rotation.x = -Math.PI / 2
    //     // mesh.position.y = 0
    //     // mesh.receiveShadow = true

    //     let PlaneGeometry = new THREE.PlaneGeometry(50, 50)
    //     let groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture })
    //     let plane = new THREE.Mesh(PlaneGeometry, groundMaterial)
    //     plane.position.set(0, -1, 0)
    //     plane.rotation.x = -Math.PI/2
    //     plane.receiveShadow = true
    //     scene.add(plane)
    // })
}

// 创建建筑
function createBuilding(scene: THREE.Scene) {
    let _texture = new URL('../../assets/person/house/scene.gltf', import.meta.url).href
    let loader = new GLTFLoader()
    loader.setDRACOLoader(new DRACOLoader())
    loader.load(_texture, (gltf) => {
        let _obj = gltf.scene
        _obj.scale.set(0.5, 0.5, 0.5)
        _obj.rotation.set(0, -Math.PI / 2, 0)
        _obj.position.set(-10, 0, -10)
        scene.add(_obj)
    })

    let _texture2 = new URL('../../assets/person/house1/scene.gltf', import.meta.url).href
    let loader2 = new GLTFLoader()
    loader2.setDRACOLoader(new DRACOLoader())
    loader2.load(_texture2, (gltf) => {
        let _obj = gltf.scene
        _obj.traverse((o) => {
            // 启用投射和接收阴影的能力
            o.castShadow = true
            o.receiveShadow = true
            // o.material = material
        })
        _obj.scale.set(0.02, 0.02, 0.02)
        // _obj.rotation.set(0, -Math.PI / 2, 0)
        _obj.position.set(10, 0, -10)
        scene.add(_obj)
    })
}

// 创建dragon ball
function createDragonBall(scene: THREE.Scene) {
    let _texture = new URL('../../assets/person/dragon_ball/scene.gltf', import.meta.url).href
    let loader = new GLTFLoader()
    loader.setDRACOLoader(new DRACOLoader())
    loader.load(_texture, (gltf) => {
        let _obj = gltf.scene
        _obj.traverse((o) => {
            // 启用投射和接收阴影的能力
            o.castShadow = true
            o.receiveShadow = true
            // o.material = material
        })
        scene.add(_obj)
    })
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

// 创建人物2
function createPeople2(scene: any) {
    const _texture = new URL('../../assets/people/scene.gltf', import.meta.url).href
    let loader = new GLTFLoader()
    loader.setDRACOLoader(new DRACOLoader())
    loader.load(_texture, result => {
        console.log(result)
        // result.scene.traverse((child) => {
        //     console.log(child)
        //     // if (child.isMesh) {
        //     //     child.material.metalness = 0;
        //     //     child.material.roughness = 1;
        //     // }
        // })
        peopleObj = result.scene
        peopleObj.scale.set(1, 1, 1)
        peopleObj.position.set(5, 0, 0)
        scene.add(peopleObj)
        // mixer = new THREE.AnimationMixer(peopleObj);
        // peopleObj.animations.forEach((clip) => {
        //   mixer.clipAction(clip).play();
        // });
    })
}

let birdMixer, birdAction
function createBird(scene: any, bridMinxerArr: any) {
    const _texture = new URL('../../assets/bird/scene.gltf', import.meta.url).href
    let loader = new GLTFLoader()
    loader.setDRACOLoader(new DRACOLoader())
    loader.load(_texture, result => {
        let _obj = result.scene
        _obj.traverse((o) => {
            // 启用投射和接收阴影的能力
            o.castShadow = true
            o.receiveShadow = true
        })

        _obj.scale.set(0.01, 0.01, 0.01)
        _obj.position.set(
            -25 + +(Math.random() * 10).toFixed(1), 
            0, 
            Math.random() * 10
        )
        _obj.rotation.y = Math.PI / 3
        scene.add(_obj)

        // 动画数据
        const animations = result.animations
        // 创建模型动作混合器
        birdMixer = new THREE.AnimationMixer(_obj) 
        bridMinxerArr.push(birdMixer)
        birdAction = birdMixer.clipAction(animations[0])

        birdAction.play()
    })
}

function createHomeDioroma(scene: THREE.Scene) {
    const _texture = new URL('../../assets/person/home_dioroma/scene.gltf', import.meta.url).href
    let loader = new GLTFLoader()
    loader.setDRACOLoader(new DRACOLoader())
    loader.load(_texture, result => {
        let _obj = result.scene
        _obj.traverse((o) => {
            // 启用投射和接收阴影的能力
            o.castShadow = true
            o.receiveShadow = true
        })

        _obj.scale.set(0.1, 0.1, 0.1)
        _obj.position.set(
            -50 + +(Math.random() * 10).toFixed(1), 
            -10 + +(Math.random() * 10).toFixed(1), 
            -100 + +(Math.random() * 10).toFixed(1)
        )
        _obj.rotation.y = Math.PI
        scene.add(_obj)
    })

    // const _texture2 = new URL('../../assets/person/the_last_stronghold_animated/scene.gltf', import.meta.url).href
    // loader.load(_texture2, result => {
    //     let _obj = result.scene
    //     _obj.traverse((o) => {
    //         // 启用投射和接收阴影的能力
    //         // o.castShadow = true
    //         // o.receiveShadow = true
    //     })

    //     _obj.scale.set(1, 1, 1)
    //     _obj.position.set(
    //         0,
    //         -10,
    //         -10
    //     )
    //     _obj.rotation.y = Math.PI
    //     scene.add(_obj)
    // })
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

// 创建跑车
function createDreamCar(scene: any) {
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    loader.load(_car_texture2, function(gltf) {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material.metalness = 0;
                child.material.roughness = 1;
            }
        })

		const carModel:any = gltf.scene.children[0]
		// carModel.getObjectByName('body').material = bodyMaterial
		// carModel.getObjectByName('rim_fl').material = detailsMaterial
		// carModel.getObjectByName('rim_fr').material = detailsMaterial
		// carModel.getObjectByName('rim_rr').material = detailsMaterial
		// carModel.getObjectByName('rim_rl').material = detailsMaterial
		// carModel.getObjectByName('trim').material = detailsMaterial

		// carModel.getObjectByName('glass').material = glassMaterial

		// wheels.push(
		// 	carModel.getObjectByName('rim_fl'),
		// 	carModel.getObjectByName('rim_fr'),
		// 	carModel.getObjectByName('rim_rr'),
		// 	carModel.getObjectByName('rim_rl')
		// )

		// shadow
		const mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
			new THREE.MeshBasicMaterial({
				map: shadow,
				blending: THREE.MultiplyBlending,
				toneMapped: false,
				transparent: true
			})
		)

		// 设置阴影效果x轴方向的角度
		mesh.rotation.x = -Math.PI / 2
		mesh.renderOrder = 2
		carModel.add(mesh)
		scene.add(carModel)
	})
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
