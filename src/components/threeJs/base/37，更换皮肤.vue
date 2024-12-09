<script setup>
import { onMounted, nextTick } from 'vue'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const _texture = new URL('./equirectangular/moonless_golf_1k.hdr', import.meta.url).href
const _texture1 = new URL('./gltf/ferrari_ao.png', import.meta.url).href
const _texture2 = new URL('../source/Car2/gltf/ferrari.glb', import.meta.url).href

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
	roughness‌s: 0,
	transmission: 10
})

onMounted(() => {
	nextTick(() => {
		main()
	})
})

function main() {
	let wheels = []
	// 场景
	let scene = new THREE.Scene();
	scene.background = new THREE.Color(0x333333) // 设置背景
	// 通过RGBELoader加载hdr文件，它是一种图像格式，将其用作场景的环境映射或者用来创建基于物理的材质
	scene.environment = new RGBELoader().load(_texture)
	// 设置环境映射模式为EquirectangularReflectionMapping
	scene.environment.mapping = THREE.EquirectangularReflectionMapping
	// 这个类中的参数定义了线性雾。也就是说，雾的密度是随着距离线性增大的
	scene.fog = new THREE.Fog(0x333333, 10, 15)

	/**
	 * 创建网格对象
	 * 参数1: 大小
	 * 参数2: 网格细分次数
	 * 参数3: 网格中线颜色
	 * 参数4: 网格线条颜色
	 */
	// let grid = new THREE.GridHelper(40, 40, 0xffffff, 0xffffff)
	// // 网格透明度
	// grid.material.opacity = 0.3
	// grid.material.depthWrite = false
	// grid.material.transparent = true
	// scene.add(grid)

	/**
	 * 创建透视相机
	 * 参数一：摄像机视锥体垂直视野角度
     * 参数二：摄像机视锥体长宽比
     * 参数三：摄像机视锥体近端面
     * 参数四：摄像机视锥体远端面
	 */
	let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.3, 100)
	camera.position.set(4.2, 1.4, -4.5)

	// 创建渲染器
	// antialias是否执行抗锯齿。默认为false
	let canvas = document.getElementById('canvas')
	let renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
	// 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
	renderer.setPixelRatio(window.devicePixelRatio)
	// 设置渲染出来的画布范围
	renderer.setSize(window.innerWidth, window.innerHeight)
	
	// 创建控制器。支持鼠标操作图像
	let controls = new OrbitControls(camera, canvas)
	// 你能够将相机向外移动多少（仅适用于PerspectiveCamera），其默认值为Infinity
	controls.maxDistance = 9
	// 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI
	// controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
	controls.target.set(0, 0.5, 0)
	controls.update()

	/**
	 * 汽车模型
	 */
	let shadow = new THREE.TextureLoader().load(_texture1)
	const dracoLoader = new DRACOLoader()
	dracoLoader.setDecoderPath('./draco/gltf/')

	let loader = new GLTFLoader()
	loader.setDRACOLoader(dracoLoader)


	loader.load(_texture2, function(gltf) {
		let carModel = gltf.scene.children[0]
		carModel.getObjectByName('body').material = bodyMaterial
		carModel.getObjectByName('rim_fl').material = detailsMaterial
		carModel.getObjectByName('rim_fr').material = detailsMaterial
		carModel.getObjectByName('rim_rr').material = detailsMaterial
		carModel.getObjectByName('rim_rl').material = detailsMaterial
		carModel.getObjectByName('trim').material = detailsMaterial

		carModel.getObjectByName('glass').material = glassMaterial

		// wheels.push(
		// 	carModel.getObjectByName('rim_fl'),
		// 	carModel.getObjectByName('rim_fr'),
		// 	carModel.getObjectByName('rim_rr'),
		// 	carModel.getObjectByName('rim_rl')
		// )

		// shadow
		let mesh = new THREE.Mesh(
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

	function render() {
		if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

		requestAnimationFrame(render)
        renderer.render(scene, camera)
	}

	requestAnimationFrame(render)
}
</script>

<template>
	<div class="container">
        <canvas id="canvas"></canvas>
		<!--设置三个按钮，用于切换车身、轮毂、玻璃的颜色-->
		<div id="info">
			<span class="colorPicker">
				<input id="body-color" type="color" value="#ff0000" />
				<br/>
				Body
			</span>
			<span class="colorPicker">
				<input id="details-color" type="color" value="#ffffff" />
				<br/>
				Details
			</span>
			<span class="colorPicker">
				<input id="glass-color" type="color" value="#ffffff" />
				<br/>
				Glass
			</span>
		</div>  
    </div>
</template>

<style scoped>
#info {
	position: absolute;
	top: 0px;
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	text-align: center;
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
	pointer-events: none;
	z-index: 1; /* TODO Solve this in HTML */
}

a, button, input, select {
	pointer-events: auto;
}

.lil-gui {
	z-index: 2 !important; /* TODO Solve this in HTML */
}

@media all and ( max-width: 640px ) {
	.lil-gui.root { 
		right: auto;
		top: auto;
		max-height: 50%;
		max-width: 80%;
		bottom: 0;
		left: 0;
	}
}

#overlay {
	position: absolute;
	font-size: 16px;
	z-index: 2;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background: rgba(0,0,0,0.7);
}

	#overlay button {
		background: transparent;
		border: 0;
		border: 1px solid rgb(255, 255, 255);
		border-radius: 4px;
		color: #ffffff;
		padding: 12px 18px;
		text-transform: uppercase;
		cursor: pointer;
	}

#notSupported {
	width: 50%;
	margin: auto;
	background-color: #f00;
	margin-top: 20px;
	padding: 10px;
}

</style>