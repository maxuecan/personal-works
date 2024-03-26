<!-- 阴影 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
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

    // 摄像头
    let fov = 45
    let aspect = 2
    let near = 0.1
    let far = 100
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 10, 20)
    camera.lookAt(0, 0, 0)

    // 场景
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('white')

    // 平面纹理
    let loader = new THREE.TextureLoader()
    {
        let planeSize = 40
        
        let texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        texture.colorSpace = THREE.SRGBColorSpace

        let repeats = planeSize / 2
        texture.repeat.set(repeats, repeats)

        // 几何体
        let planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
        // 材质
        let planeMat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        })
        planeMat.color.setRGB(1.5, 1.5, 1.5)
        
        // 网格
        let mesh = new THREE.Mesh(planeGeo, planeMat)
        mesh.rotation.x = Math.PI * - .5
        scene.add(mesh)
    }

    // 阴影纹理
    let shadowTexture = loader.load('https://threejs.org/manual/examples/resources/images/roundshadow.png')
    let sphereShadowBases:Array<any> = []
    {
        let sphereRadius = 1
        let sphereWidthDivsions = 32
        let sphereHeightDivisions = 16
        let sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivsions, sphereHeightDivisions)

        let planeSize = 1
        let shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize)

        let numSpheres = 15
        for (let i = 0; i < numSpheres; ++i) {
            let base = new THREE.Object3D()
            scene.add(base)

            let shadowMath = new THREE.MeshBasicMaterial({
                map: shadowTexture,
                transparent: true,
                depthWrite: false
            })
            let shadowMesh = new THREE.Mesh(shadowGeo, shadowMath)
            shadowMesh.position.y = 0.0001
            shadowMesh.rotation.x = Math.PI * - .5
            let shadowSize = sphereRadius * 4
            shadowMesh.scale.set(shadowSize, shadowSize, shadowSize)
            base.add(shadowMesh)

            let u = i / numSpheres
            let sphereMat = new THREE.MeshPhongMaterial()
            sphereMat.color.setHSL(u, 1, .75)
            let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
            sphereMesh.position.set(0, sphereRadius + 2, 0)
            base.add(sphereMesh)

            sphereShadowBases.push({
                base,
                sphereMesh,
                shadowMesh,
                y: sphereMesh.position.y
            })
        }
    }

    // 光源
    {
        let skyColor = 0xB1E1FF
        let groundColor = 0xB97A20
        let intensity = 0.75
        let light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
        scene.add(light)
    }
    {
        let color = 0xFFFFFF
        let intensity = 2.5
        let light = new THREE.DirectionalLight(color, intensity)
        light.position.set(0, 10, 5)
        light.target.position.set(-5, 0, 0)
        scene.add(light)
        scene.add(light.target)
    }

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
        time *= 0.001
        resizeRendererToDisplaySize(renderer)

        {
            let canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        sphereShadowBases.forEach((sphereShadowBase, ndx) => {
            let {base, sphereMesh, shadowMesh, y} = sphereShadowBase

            let u = ndx / sphereShadowBases.length

            let speed = time * .2
            let angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1)
            let radius = Math.sin(speed - ndx) * 10
            base.position.set( Math.cos( angle ) * radius, 0, Math.sin( angle ) * radius );

			// yOff is a value that goes from 0 to 1
			const yOff = Math.abs( Math.sin( time * 2 + ndx ) );
			// move the sphere up and down
			sphereMesh.position.y = y + THREE.MathUtils.lerp( - 2, 2, yOff );
			// fade the shadow as the sphere goes up
			shadowMesh.material.opacity = THREE.MathUtils.lerp( 1, .25, yOff );
        })

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
