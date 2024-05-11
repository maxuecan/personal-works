<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
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
    // scene.fog = new THREE.Fog(0x333333, 10, 15) // 雾化效果
    // scene.background = new THREE.Color('black')

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

    // 创建云的材质
    // const cloudGeometry = new THREE.BoxGeometry(50, 50, 50)
    // const cloudMaterial = new THREE.MeshPhongMaterial({
    //     color: 0xcccccc,
    //     transparent: true,
    //     opacity: 0.3
    // })
    // const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
    // scene.add(cloud)

    // 创建粒子系统
    let cloud_img = new URL('../../../assets/threejs/cloud.png', import.meta.url).href
    const particleCount = 1000
    const particles = new THREE.Group()
    const sprite = new THREE.TextureLoader().load(cloud_img);
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Sprite(new THREE.SpriteMaterial({
            map: sprite,
            transparent: true,
            opacity: 0.5
        }))
        particle.position.set(
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500
        )
        particle.scale.set(10, 10, 10)
        particles.add(particle)
    }
    scene.add(particles)

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

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
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
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
