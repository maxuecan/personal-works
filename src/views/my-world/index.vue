<!-- 我的世界 -->
<template>
    <div class="container">
        <canvas id="my-world" ref="myWorld"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// import { TWEEN } from '@tweenjs/tween.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { getCurrentInstance, onMounted, nextTick, render } from 'vue';

let { ctx } = getCurrentInstance() as any

onMounted(async () => {
    await nextTick()
    window.onload= main()
})

function main() {
    let gui;
    let grid;
    let clock = new THREE.Clock()
    let peopleObj, activeAction, peopleAnimations, tween, mixer, peopleBox;
    let mixerArr = [];
    let clickEffectObj;

    const canvas = ctx.$refs.myWorld

    // 渲染器
    // 创建一个渲染器并设置大小，WebGLRenderer将会使用电脑显卡来渲染场景
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true,
        canvas
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    // 相机
    let fov = 60 // 视角
    let aspect = 2 // 视宽比
    let near = 0.1 // 进
    let far = 100 // 远
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 10, 20) // x y z

    // 控制器
    let controls = new OrbitControls(camera, canvas)
    // 是否可以缩放
    controls.enableZoom = false
    // 启用或禁用摄像机平移
    controls.enablePan = false
    controls.minPolarAngle = Math.PI / 3
    controls.maxPolarAngle = Math.PI / 2.05

    controls.target = new THREE.Vector3(0, 1, 0)
    controls.object.position.set(0, 2, -4)
    controls.update(true) // 初始化

    let _texture = new URL('../../assets/texture/venice_sunset_1k.hdr', import.meta.url).href
    // 场景
    let scene = new THREE.Scene()

    scene.background = new THREE.Color('#000000')
    scene.environment = new RGBELoader().load(_texture)
    scene.environment.mapping = THREE.EquirectangularReflectionMapping
    scene.fog = new THREE.Fog(0x333333, 10, 15)

    grid = new THREE.GridHelper(200, 400, 0xffffff, 0xffffff)
    grid.material.opacity = 0.2
    grid.material.depthWrite = false
    grid.material.transparent = true
    scene.add(grid)

    // 在屏幕上显示坐标轴
    let axes = new THREE.AxesHelper(10)
    // scene.add(axes)
    scene.add(new THREE.AmbientLight(0xe0ffff, 1))


    // 地面
    // {
    //     const planeSize = 40
    //     const loader = new THREE.TextureLoader()
    //     const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
    //     texture.wrapS = THREE.RepeatWrapping
    //     texture.wrapT = THREE.RepeatWrapping
    //     texture.magFilter = THREE.NearestFilter
    //     texture.colorSpace = THREE.SRGBColorSpace
    //     const repeats = planeSize / 2
    //     texture.repeat.set(repeats, repeats)

    //     const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    //     const planeMat = new THREE.MeshPhongMaterial({
    //         map: texture,
    //         side: THREE.DoubleSide
    //     })
    //     const mesh = new THREE.Mesh(planeGeo, planeMat)
    //     mesh.rotation.x = Math.PI * -.5
    //     scene.add(mesh)
    // }

    // 环境光
    {
        const skyColor = 0xB1E1FF // 天空
        const groundColor = 0xB97A20 // 地面
        const intensity = 2 // 光强
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
        scene.add(light)
    }

    // 资源加载
    // {
    //     // 第三版
    //     // 加载人物模型，模型glb格式
    //     let peopleObj = null
    //     let peopleAnimations = null

    //     let mixer = null
    //     let minerArr = []

    //     let activeAction = null
        
    //     const gltf_peo = new URL('../../components/threeJs/source/people1/people.glb', import.meta.url).href
    //     let gloader = new GLTFLoader()
    //     gloader.load(gltf_peo, result => {
    //         peopleObj = result.scene
    //         peopleAnimations = result.animations

    //         // 主人物名称，并设置相对位置
    //         let spriteText = getTextCanvas('马学灿')
    //         spriteText.position.set(0, 2, 0)
    //         peopleObj.add(spriteText)

    //         // 组合对象添加到场景中
    //         scene.add(peopleObj)

    //         // 默认博凡人物站立动画
    //         mixer = new THREE.AnimationMixer(peopleObj)
    //         minerArr.push(mixer)
            
    //         activeAction = mixer.clipAction(peopleAnimations[0])
    //         activeAction.play()
    //     })

    //     // 第二版
    //     // const gltf_peo = new URL('../../components/threeJs/source/man/man.gltf', import.meta.url).href
    //     // let mixer, action, model;
    //     // let clock = new THREE.Clock() // 时钟对象

    //     // let gltfLoader = new GLTFLoader()
    //     // gltfLoader.load(gltf_peo, (_gltf: any) => {
    //     //     model = _gltf.scene
    //     //     scene.add(model)

    //     //     // 加载谷歌动作动画模型
    //     //     let loader = new GLTFLoader()
    //     //     loader.load(gltf_peo, (_result: any) => {
    //     //         // 创建骨骼动画
    //     //         mixer = new THREE.AnimationMixer(model)
    //     //         console.log(_result)
    //     //         action = mixer.clipAction(_result.animations[0])
    //     //         action.play()
    //     //     })
    //     // })

    //     // // 控制人物行走的方向和速度
    //     // let direction = new THREE.Vector3()
    //     // let speed = 0.1
    //     // document.addEventListener('keydown', function(event) {
    //     //     switch(event.keyCode) {
    //     //         case 38:
    //     //             direction.z = -1
    //     //             break
    //     //         case 40:
    //     //             direction.z == 1
    //     //             break
    //     //         case 37:
    //     //             direction.x = -1
    //     //         case 39:
    //     //             direction.x = 1
    //     //             break
    //     //     }
    //     // })
    //     // document.addEventListener('keyup', function(event) {
    //     //     switch(event.keyCode) {
    //     //         case 38:
    //     //         case 40:
    //     //             direction.z = 0
    //     //             break
    //     //         case 37:
    //     //         case 39:
    //     //             direction.x = 0
    //     //             break
    //     //     }
    //     // })
    //     // // 更新人物的位置
    //     // function animate() {
    //     //     requestAnimationFrame(animate)
    //     //     if (mixer) {
    //     //         mixer.update(clock.getDelta())
    //     //     }

    //     //     if (model && direction.lengthSq() > 0) {
    //     //         var distance = speed * clock.getDelta();
    //     //         var rotation = new THREE.Matrix4().makeRotationFromQuaternion(model.quaternion);
    //     //         var directionWorld = new THREE.Vector3().copy(direction).applyMatrix4(rotation);
    //     //         model.position.add(directionWorld.multiplyScalar(distance));
    //     //     }
    //     //     renderer.render(scene, camera)
    //     // }
        
    //     // 第一版
    //     // const mtl_car = new URL('../../components/threeJs/source/Car1/Avent_sport.mtl', import.meta.url).href
    //     // const obj_car = new URL('../../components/threeJs/source/Car1/Avent_sport.obj', import.meta.url).href

    //     // const mtLoader = new MTLLoader()
    //     // mtLoader.load(mtl_car, (_mtl: any) => {
    //     //     _mtl.preload()

    //     //     const objLoader = new OBJLoader()
    //     //     objLoader.setMaterials(_mtl)
    //     //     objLoader.load(obj_car, (_root: any) => {
    //     //         _root.position.set(0, .5, 0)
    //     //         scene.add(_root)
    //     //     })
    //     // })
    // }
    

    // 创建文字精灵
    function getTextCanvas(text: String) {
        let option = {
            fontFamily: 'Arial',
            fontSize: 30,
            fontWight: 'blod',
            color: '#ffffff',
            actualFontSize: 0.08
        }

        let canvas, context, textWidth, texture, materialObj, spriteObj;
        canvas = document.createElement('canvas')
        context = canvas.getContext('2d')
        // 设置字体大小后获取文本宽高
        context.font = option.fontWight + ' ' + option.fontSize + 'px' + option.fontFamily
        textWidth = context?.measureText(text).width

        canvas.width = textWidth
        canvas.height = option.fontSize

        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = option.color
        context.font = option.fontWight + ' ' + option.fontSize + 'px' + option.fontFamily
        context.fillText(text, textWidth / 2, option.fontSize / 1.8)

        texture = new THREE.CanvasTexture(canvas)
        materialObj = new THREE.SpriteMaterial({
            map: texture
        })
        spriteObj = new THREE.Sprite(materialObj)
        spriteObj.scale.set(textWidth / option.fontSize * option.actualFontSize, option.actualFontSize, option.actualFontSize)
        return spriteObj
    }

    // 鼠标点击位置出现动画效果
    function clickEffect() {
        let textures = [];
        let index = 0;
        let clickEffectMesh;

        let stop = new URL('../../assets/spotd.png', import.meta.url).href
        // 加载图片
        let loader = new THREE.ImageLoader()
        loader.load(stop, function(image) {
            let canvas, context, geometry, material, plane;
            let w = image.width
            let num = image.height / image.width

            for (let i = 0; i < num; i++) {
                textures[i] = new THREE.Texture()
            }

            for (let i = 0; i < num; i++) {
                canvas = document.createElement('canvas')
                context = canvas.getContext('2d')
                canvas.height = w
                canvas.width = w
                context?.drawImage(image, 0, w * i, w, w, 0, 0, w, w)
                textures[i].image = canvas
                textures[i].needsUpdate = true
            }

            // // 创建平面几何体，添加图片材质并设置透明和两面渲染
            // geometry = new THREE.PlaneGeometry(1, 1)
            // material = new THREE.MeshBasicMaterial({
            //     map: textures[0],
            //     transparent: true,
            //     side: THREE.DoubleSide
            // })

            clickEffectMesh = new THREE.Mesh(geometry, material)
            clickEffectMesh.rotateX(Math.PI / 2)
            clickEffectMesh.visible = false

            scene.add(clickEffectMesh)
        })

        // 播放动画，设置定时顺序更新材质
        this.effect = function(x, y, z) {
            clickEffectMesh.visible = true
            clickEffectMesh.position.set(x, y, z)
            let id = setInterval(function() {
                if (index == 10) {
                    index = 0
                    clickEffectMesh.visible = false
                    clearInterval(id)
                }
                clickEffectMesh.material.map = textures[index]
                index++
            }, 20)
        }
    }

    // 拾取对象
    function pickupObjects(event) {
        // 点击屏幕创建一个向量
        let raycaster = new THREE.Raycaster()
        let vector = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        )
        let fxl = new THREE.Vector3(0, 1, 0)
        let groundplane = new THREE.Plane(fxl, 0)
        raycaster.setFromCamera(vector, camera)
        let intersects = raycaster.ray.intersectPlane(groundplane, fxl)
        console.log(intersects)
        if (!intersects) return

        // 人物当前位置
        let originPosition = new THREE.Vector3(peopleObj.position.x, 0, peopleObj.position.z)
        // 人物目标位置
        let targetPosition = new THREE.Vector3(intersects.x, 0, intersects.z)
        clickEffectObj.effect(intersects.x, 0, intersects.z)
        // 移动距离
        let distance = originPosition.distanceTo(targetPosition)

        peopleObj.lookAt(intersects.x, 0, intersects.z)
        console.log(originPosition, targetPosition, distance)
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
            .easing(TWEEN.easing.linear.none)
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
							peopleObj.position.set(this.x, 0.04, this.z);

							let pos = peopleObj.position.clone();
							pos.y = 1;
							controls.target = pos;
							controls.update();
						})
						.start();
    }

    const gltf_peo = new URL('../../components/threeJs/source/people1/people.glb', import.meta.url).href
    let gloader = new GLTFLoader()
    gloader.load(gltf_peo, result => {
        peopleObj = result.scene
        peopleObj.scale.set(0.7, 0.7, 0.7)
        peopleAnimations = result.animations

        // 主人物名称，并设置相对位置
        let spriteText = getTextCanvas('马学灿')
        spriteText.position.set(0, 2, 0)
        peopleObj.add(spriteText)

        // 组合对象添加到场景中
        scene.add(peopleObj)

        // 默认博凡人物站立动画
        mixer = new THREE.AnimationMixer(peopleObj)
        mixerArr.push(mixer)
        
        activeAction = mixer.clipAction(peopleAnimations[0])
        activeAction.play()
    })

    clickEffectObj = new clickEffect()
    setTimeout(() => {
        document.addEventListener('click', pickupObjects, false)
    }, 1000)

    // function resizeRendererToDisplaySize(renderer: { domElement: any; setSize: (arg0: any, arg1: any, arg2: boolean) => void; }) {
    //     const canvas = renderer.domElement
    //     const width = canvas.clientHeight
    //     const height = canvas.clientHeight
    //     const needResize = canvas.width !== width || canvas.height !== height
    //     if (needResize) {
    //         renderer.setSize(width, height, false)
    //     }

    //     return needResize
    // }

    function render() {
        // if (resizeRendererToDisplaySize(renderer)) {
        //     const canvas = renderer.domElement
        //     camera.aspect = canvas.clientWidth / canvas.clientHeight
            // camera.updateProjectionMatrix()
        // }

        let dt = clock.getDelta()
        for (let i = 0; i < mixerArr.length; i++) {
            mixerArr[i].update(dt)
        }
        TWEEN.update()

        requestAnimationFrame(render)
        renderer.render(scene, camera)
    }

    requestAnimationFrame(render)
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
