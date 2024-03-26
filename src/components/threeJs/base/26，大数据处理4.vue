<!-- 26，大数据处理4 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
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
    let far = 10
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2.5

    // 控制器
    let controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 1.2
    controls.maxDistance = 4
    controls.update()

    // 场景
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('black')

    // 添加网格步骤工具
    // scene.add(new THREE.GridHelper(5000, 10))

    // 地球网格
    {
        const loader = new THREE.TextureLoader()
        const texture = loader.load('https://threejs.org/manual/examples/resources/images/world.jpg', render)
        texture.colorSpace = THREE.SRGBColorSpace;
        const geometry = new THREE.SphereGeometry(1, 64, 32)
        const material = new THREE.MeshBasicMaterial({map: texture})
        scene.add(new THREE.Mesh(geometry, material))
    }

    // 加载文件数据
    async function loadFile(url) {
        const req = await fetch(url)
        return req.text()
    }

    function parseData(text) {
        const data = []
        const settings = { data }
        let max
        let min

        // 切割每一行
        text.split('\n').forEach((line) => {
            const parts = line.trim().split(/\s+/)

            if (parts.length === 2) {
                settings[parts[0]] = parseFloat(parts[1])
            } else if (parts.length > 2) {
                const values = parts.map((v) => {
                    const value = parseFloat(v)
                    if (value === settings.NODATA_value) {
                        return undefined
                    }
                    max = Math.max(max === undefined ? value : max, value)
                    min = Math.min(min === undefined ? value : min, value)
                    return value
                })
                data.push(values)
            }
        })
        return Object.assign(settings, {min, max})
    }

    // 画点
    function addBoxes(file) {
        const { min, max, data } = file
        const range = max - min

        // 位置辅助器可以方便在球面上定位
        // 经度辅助器可以在XZ平面的法向旋转
        const lonHelper = new THREE.Object3D()
        scene.add(lonHelper)
        // 纬度辅助器可以在XZ平面旋转
        const latHelper = new THREE.Object3D()
        lonHelper.add(latHelper)
        // 组合起来得到的位置辅助器可以在球面上定位
        const positionHelper = new THREE.Object3D()
        positionHelper.position.z = 1
        latHelper.add(positionHelper)

        const originHelper = new THREE.Object3D()
        originHelper.position.z = 0.5
        positionHelper.add(originHelper)

        const color = new THREE.Color()

        const lonFudge = Math.PI * .5
        const latFudge = Math.PI * -0.135
        const geometries = []
        data.forEach((row, latNdx) => {
            row.forEach((value, lonNdx) => {
                if (value === undefined) return

                const amount = (value - min) / range

                const boxWidth = 1
                const boxHeight = 1
                const boxDepth = 1
                const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

                // 调整辅助器使其指向经纬度
                lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge
                latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge
                
                // 使用world matrix来操作辅助器
                positionHelper.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount))
                originHelper.updateWorldMatrix(true, false)
                geometry.applyMatrix4(originHelper.matrixWorld)

                // 计算颜色
                const hue = THREE.MathUtils.lerp(0.7, 0.3, amount)
                const saturation = 1
                const lightness = THREE.MathUtils.lerp(0.4, 1.0, amount)
                color.setHSL(hue, saturation, lightness)
                // 以0到255之间的值数组形式获取颜色
                const rgb = color.toArray().map(v => v * 255)

                // 创建一个数组来存储每个顶点的颜色
                const numVerts = geometry.getAttribute('position').count
                const itemSize = 3
                const colors = new Uint8Array(itemSize * numVerts)

                // 将颜色复制到每个顶点的颜色数组中
                colors.forEach((v, ndx) => {
                    colors[ndx] = rgb[ndx % 3]
                })

                const normalized = true
                const colorAttrib = new THREE.BufferAttribute(colors, itemSize, normalized)
                geometry.setAttribute('color', colorAttrib)

                geometries.push(geometry)
            })
        })
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false)
        const material = new THREE.MeshBasicMaterial({
            vertexColors: true
        })
        const mesh = new THREE.Mesh(mergedGeometry, material)
        scene.add(mesh)
    }

    loadFile('https://threejs.org/manual/examples/resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
        .then(parseData)
        .then(addBoxes)
        .then(render)

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
            renderer.setSize(width, height, false)
        }
        return needResize
    }

    let renderRequested = false

    function render() {
        renderRequested = undefined
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        controls.update()
        renderer.render(scene, camera)
    }

    render()

    function requestRenderIfNotRequested() {
        if (!renderRequested) {
            renderRequested = true
            requestAnimationFrame(render)
        }
    }

    controls.addEventListener('change', requestRenderIfNotRequested)
    window.addEventListener('resize', requestRenderIfNotRequested)
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