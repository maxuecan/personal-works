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

import { getCurrentInstance, onMounted, nextTick } from 'vue';

let { ctx } = getCurrentInstance() as any
onMounted(async () => {
    await nextTick()
    main()
})

function main() {
    let clock = new THREE.Clock()
    let tween: TWEEN
    let clickEffectObj

    const canvas = ctx.$refs.myWorld

    // 渲染器 (创建一个渲染器并设置大小，WebGLRenderer将会使用电脑显卡来渲染场景)
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true,
        canvas
    })
    // renderer.setPixelRatio(window.devicePixelRatio)
    // renderer.setSize(window.innerWidth, window.innerHeight)

    // 相机
    let fov = 40 // 视角
    let aspect = window.innerWidth / window.innerHeight // 视宽比
    let near = 0.1 // 进
    let far = 10000 // 远
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    // camera.position.set(0, 10, 20) // x y z

    // 控制器
    let controls = new OrbitControls(camera, canvas)
    controls.enableZoom = false // 是否可以缩放
    controls.enablePan = false // 启用或禁用摄像机平移
    controls.enableRotate = false // 是否启用旋转功能
    controls.minPolarAngle = Math.PI / 3
    controls.maxPolarAngle = Math.PI / 2.05

    controls.target = new THREE.Vector3(0, 1, 0)
    controls.object.position.set(0, 2, -4)
    controls.update()

    // 纹理
    let _texture = new URL('../../assets/texture/venice_sunset_1k.hdr', import.meta.url).href

    // 场景
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('#000000')
    scene.environment = new RGBELoader().load(_texture)
    scene.environment.mapping = THREE.EquirectangularReflectionMapping
    scene.fog = new THREE.Fog(0x333333, 10, 15)

    let grid = new THREE.GridHelper(200, 400, 0xffffff, 0xffffff)
    grid.material.opacity = 0.2
    grid.material.depthWrite = false
    grid.material.transparent = true
    scene.add(grid)

    // 环境光
    {
        const skyColor = 0xB1E1FF // 天空
        const groundColor = 0xB97A20 // 地面
        const intensity = 2 // 光强
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
        scene.add(light)
    }

    // 人物
    let peopleObj, peopleAnimations, activeAction, mixer;
    let mixerArr = []
    const gltf_peo = new URL('../../components/threeJs/source/people1/people.glb', import.meta.url).href
    let gloader = new GLTFLoader()
    gloader.load(gltf_peo, result => {
        peopleObj = result.scene
        peopleObj.scale.set(0.7, 0.7, 0.7)
        peopleAnimations = result.animations

        // 主人物名称，并设置相对位置
        // let spriteText = getTextCanvas('马学灿')
        // spriteText.position.set(0, 2, 0)
        // peopleObj.add(spriteText)

        // 组合对象添加到场景中
        scene.add(peopleObj)

        // 默认博凡人物站立动画
        mixer = new THREE.AnimationMixer(peopleObj)
        mixerArr.push(mixer)
        
        activeAction = mixer.clipAction(peopleAnimations[0])
        activeAction.play()
    })

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
    
    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        let dt = clock.getDelta()
        for (let i = 0; i < mixerArr.length; i++) {
            mixerArr[i].update(dt)
        }
        TWEEN.update()

        requestAnimationFrame(render)
        renderer.render(scene, camera)
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

        if (!intersects) return

        // 人物当前位置
        let originPosition = new THREE.Vector3(peopleObj.position.x, 0, peopleObj.position.z)
        // 人物目标位置
        let targetPosition = new THREE.Vector3(intersects.x, 0, intersects.z)


        // 移动距离
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
    
    // 鼠标点击位置出现动画效果
    function clickEffect() {
		var textures = [];
		var index = 0;
		var clickEffectMesh;

		var loader = new THREE.ImageLoader();
        let stop = new URL('../../assets/spotd.png', import.meta.url).href
		loader.load(stop, function(image) {
			let canvas, context, geometry, material, plane;
			let w = image.width;
			let num = image.height / image.width;

			for (let i = 0; i < num; i++) {
				textures[i] = new THREE.Texture();
			}

			for (let i = 0; i < num; i++) {
				canvas = document.createElement('canvas');
				context = canvas.getContext('2d');
				canvas.height = w;
				canvas.width = w;
				context.drawImage(image, 0, w * i, w, w, 0, 0, w, w);
				textures[i].image = canvas;
				textures[i].needsUpdate = true;
			}

			geometry = new THREE.PlaneGeometry(1, 1);
			material = new THREE.MeshBasicMaterial({
				map: textures[0],
				transparent: true,
				side: THREE.DoubleSide,
			});

			clickEffectMesh = new THREE.Mesh(geometry, material);
			clickEffectMesh.rotateX(Math.PI / 2);
			clickEffectMesh.visible = false;

			scene.add(clickEffectMesh);
		});

		this.effect = function(x, y, z) {
			clickEffectMesh.visible = true;
			clickEffectMesh.position.set(x, y, z);
			let id = setInterval(function() {
				if (index == 10) {
					index = 0;
					clickEffectMesh.visible = false;
					clearInterval(id);
				}
				clickEffectMesh.material.map = textures[index];
				index++;
			}, 20)
		}
	}
    clickEffectObj = new clickEffect()

    // 监听单机拾取对象初始化球体
    document.addEventListener('click', pickupObjects, false)

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
