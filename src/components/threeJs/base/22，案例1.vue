<!-- 22，案例1 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
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
    let far = 10000
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 1000, 2000)

    // 控制器
    let controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 5, 0)
    controls.update()

    // 场景
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('black')

    // 添加网格步骤工具
    scene.add(new THREE.GridHelper(5000, 10))

    // 曲线（路线）
    let curve:any
    let curveObject
    {
        let controlPoints = [
            [ 1.118281, 5.115846, - 3.681386 ],
			[ 3.948875, 5.115846, - 3.641834 ],
			[ 3.960072, 5.115846, - 0.240352 ],
			[ 3.985447, 5.115846, 4.585005 ],
			[ - 3.793631, 5.115846, 4.585006 ],
			[ - 3.826839, 5.115846, - 14.736200 ],
			[ - 14.542292, 5.115846, - 14.765865 ],
			[ - 14.520929, 5.115846, - 3.627002 ],
			[ - 5.452815, 5.115846, - 3.634418 ],
			[ - 5.467251, 5.115846, 4.549161 ],
			[ - 13.266233, 5.115846, 4.567083 ],
			[ - 13.250067, 5.115846, - 13.499271 ],
			[ 4.081842, 5.115846, - 13.435463 ],
			[ 4.125436, 5.115846, - 5.334928 ],
			[ - 14.521364, 5.115846, - 5.239871 ],
			[ - 14.510466, 5.115846, 5.486727 ],
			[ 5.745666, 5.115846, 5.510492 ],
			[ 5.787942, 5.115846, - 14.728308 ],
			[ - 5.423720, 5.115846, - 14.761919 ],
			[ - 5.373599, 5.115846, - 3.704133 ],
			[ 1.004861, 5.115846, - 3.641834 ]
        ]
        let p0 = new THREE.Vector3()
        let p1 = new THREE.Vector3()
        curve = new THREE.CatmullRomCurve3(
            controlPoints.map((p, ndx) => {
                p0.set(...p)
                p1.set(...controlPoints[(ndx + 1) % controlPoints.length])
                return [
                    (new THREE.Vector3()).copy(p0),
                    (new THREE.Vector3()).lerpVectors(p0, p1, 0.1),
                    (new THREE.Vector3()).lerpVectors(p0, p1, 0.9)
                ]
            }).flat(),
            true,
        )
        {
            let points = curve.getPoints(250)
            let geometry = new THREE.BufferGeometry().setFromPoints(points)
            let material = new THREE.LineBasicMaterial({color: 0xff0000})
            curveObject = new THREE.Line(geometry, material)
            curveObject.scale.set(100, 100, 100)
            curveObject.position.y = -621
            material.depthTest = false
            curveObject.renderOrder = 1
            scene.add(curveObject)
        }
    }

    // 几何体/材质
    let geometry = new THREE.BoxGeometry(100, 100, 300)
    let material = new THREE.MeshBasicMaterial({color: 'cyan'})

    // 小车模型
    let cars:any = []
    for(let i = 0; i < 10; i++) {
        // 网格
        let mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        cars.push(mesh)
    }

    // 创建三维数组，用于计算路径
    let carPosition = new THREE.Vector3()
    let carTarget = new THREE.Vector3()

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
        time *= 0.001; // 将事件单位变为秒

        {
            let pathTime = time * .01
            let targetOffset = 0.01
            cars.forEach((car, ndx) => {
                let u = pathTime + ndx / cars.length

                curve.getPointAt(u % 1, carPosition)
                carPosition.applyMatrix4(curveObject.matrixWorld)

                curve.getPointAt((u + targetOffset) % 1, carTarget)
                carTarget.applyMatrix4(curveObject.matrixWorld)

                car.position.copy(carPosition)
                car.lookAt(carTarget)

                car.position.lerpVectors(carPosition, carTarget, 0.5)
            }) 
        }

        // 响应式
        if (resizeRendererToDisplaySize(renderer)) {
            let canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        renderer.render(scene, camera)
        requestAnimationFrame(render)
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