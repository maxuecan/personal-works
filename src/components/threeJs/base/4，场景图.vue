<!-- 场景图 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
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
    let gui = new GUI()

    // 相机
    let fov = 40
    let aspect = 2
    let near = 0.1
    let far = 1000
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 150, 0)
    camera.up.set(0, 0, 1)
    camera.lookAt(0, 0, 0)
    // camera.position.z = 2

    // 场景
    let scene = new THREE.Scene()

    // 灯光
    {
        let color = 0xFFFFFF
        let intensity = 500
        let light = new THREE.DirectionalLight(color, intensity)
        scene.add(light)
    }

    let objects = [] as any

    // 构建三维空间（太阳系）
    let solarSystem = new THREE.Object3D()
    scene.add(solarSystem)
    objects.push()

    // 几何体
    let radius = 1
    let widthSegments = 6
    let heightSegments = 6
    let sphereGeometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments
    )

    // 太阳材质/网格
    let sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 })
    let sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
    sunMesh.scale.set(5, 5, 5)
    solarSystem.add(sunMesh)
    objects.push(sunMesh)

    // 地球的三维空间
    let earthOrbit = new THREE.Object3D()
    earthOrbit.position.x = 10
    solarSystem.add(earthOrbit)
    objects.push(earthOrbit)


    // 地球材质/网格
    let earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233FF,
        emissive: 0x112244
    })
    let earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
    // earthMesh.position.x = 10
    // 自转
    // scene.add(earthMesh)
    // 围绕太阳转动
    // sunMesh.add(earthMesh)
    // 太阳系三维空间
    // solarSystem.add(earthMesh)
    // 地球的三维空间
    earthOrbit.add(earthMesh)
    objects.push(earthMesh)

    // 月亮的三维空间
    let moonOrbit = new THREE.Object3D()
    moonOrbit.position.x = 2
    earthOrbit.add(moonOrbit)

    // 月亮的材质/网格
    let moonMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        emissive: 0x222222
    })
    let moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
    moonMesh.scale.set(.5, .5, .5)
    moonOrbit.add(moonMesh)
    objects.push(moonMesh)

    // 创建辅助线
    function makeAxisGrid(node, label, units) {
        let helper = new AxisGirdHelper(node, units)
        gui.add(helper, 'visible').name(label)
    }
    makeAxisGrid(solarSystem, 'solarSystem', 25);
    makeAxisGrid(sunMesh, 'sunMesh');
    makeAxisGrid(earthOrbit, 'earthOrbit');
    makeAxisGrid(earthMesh, 'earthMesh');
    makeAxisGrid(moonOrbit, 'moonOrbit');
    makeAxisGrid(moonMesh, 'moonMesh');

    // 检查渲染器的canvas尺寸是不是和canvas的显示尺寸不一样
    function resizeRendererToDisplaySize(renderer: any) {
        let canvas = renderer.domElement
        // let pixelRatio = window.devicePixelRatio
        let pixelRatio = 1
        let width = canvas.clientWidth * pixelRatio | 0
        let height = canvas.clientHeight * pixelRatio | 0
        let needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
            renderer.setSize(width, height, false)
        }
        return needResize
    }

    function render(time: number) {
        time *= 0.001; // 将事件单位变为秒

        // 响应式
        if (resizeRendererToDisplaySize(renderer)) {
            let canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        // 为每个节点添加一个AxesHelper辅助线
        objects.forEach((obj) => {
            // const axes = new THREE.AxesHelper()
            // axes.material.depthTest = false
            // axes.renderOrder = 1
            // obj.add(axes)

            obj.rotation.y = time
        })

        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)

    // renderer.render(scene, camera)
}

class AxisGirdHelper {
    constructor(node, units = 10) {
        let axes = new THREE.AxesHelper()
        axes.material.depthTest = false
        axes.renderOrder = 2
        node.add(axes)

        let grid = new THREE.GridHelper(units, units)
        grid.material.depthTest = false
        grid.renderOrder = 1
        node.add(grid)

        this.grid = grid
        this.axes = axes
        this.visible = false
    }
    get visible() {
        return this._visible
    }
    set visible(v) {
        this._visible = v
        this.grid.visible = v
        this.axes.visible = v
    }
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