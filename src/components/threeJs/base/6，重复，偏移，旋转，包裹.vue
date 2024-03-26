<!-- 重复，偏移，旋转，包裹 -->
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

    // 相机
    let fov = 75
    let aspect = 2
    let near = 0.1
    let far = 5
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2

    // 场景
    let scene = new THREE.Scene()

    // 几何体
    let boxWidth = 1
    let boxHeight = 1
    let boxDepth = 1
    let geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

    let cubes = []
    // 创建纹理加载器
    let loader = new THREE.TextureLoader()
    // 加载纹理
    let texture = loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg')
    texture.colorSpace = THREE.SRGBColorSpace
    
    // 创建材质
    let material = new THREE.MeshBasicMaterial({
        map: texture
    })
    // 网格
    let cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    cubes.push(cube)
    
    // 创建辅助工具
    // 度数为单位进行操作的对象
    class DegRadHelper {
        constructor(obj, prop) {
            this.obj = obj
            this.prop = prop
        }
        get value() {
            return THREE.MathUtils.radToDeg(this.obj[this.prop])
        }
        set value(v) {
            this.obj[this.prop] = THREE.MathUtils.degToRad(v)
        }
    }

    // 创建字符转数字
    class StringToNumberHelper {
        constructor(obj, prop) {
            this.obj = obj
            this.prop = prop
        }
        get value() {
            return this.obj[this.prop]
        }
        set value(v) {
            this.obj[this.prop] = parseFloat(v)
        }
    }

    //（ClampToEdgeWrapping最后一个像素无线重复 RepeatWrapping纹理重复 MirroredRepeatWrapping每次重复时将进行镜像）
    let wrapModes = {
        'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
        'RepeatWrapping': THREE.RepeatWrapping,
        'MirroredRepeatWrapping': THREE.MirroredRepeatWrapping
    }

    function updateTexture() {
        texture.needsUpdate = true
    }

    // GUI
    let gui = new GUI()
    gui.add(new StringToNumberHelper(texture, 'wrapS'), 'value', wrapModes)
        .name('texture.wrapS')
        .onChange(updateTexture)
    gui.add(new StringToNumberHelper(texture, 'wrapT'), 'value', wrapModes)
        .name('texture.wrapT')
        .onChange(updateTexture)
    gui.add( texture.repeat, 'x', 0, 5, .01 ).name( 'texture.repeat.x' );
    gui.add( texture.repeat, 'y', 0, 5, .01 ).name( 'texture.repeat.y' );
    gui.add( texture.offset, 'x', - 2, 2, .01 ).name( 'texture.offset.x' );
    gui.add( texture.offset, 'y', - 2, 2, .01 ).name( 'texture.offset.y' );
    gui.add( texture.center, 'x', - .5, 1.5, .01 ).name( 'texture.center.x' );
    gui.add( texture.center, 'y', - .5, 1.5, .01 ).name( 'texture.center.y' );
    gui.add( new DegRadHelper( texture, 'rotation' ), 'value', - 360, 360 )
		.name( 'texture.rotation' );

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

        // 响应式
        if (resizeRendererToDisplaySize(renderer)) {
            let canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        // 多个
        cubes.forEach((cube, ndx) => {
            let speed = .2 + ndx * .1;
            let rot = time * speed;
            cube.rotation.x = rot
            cube.rotation.y = rot
        })

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
#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#loading .progress {
  margin: 1.5em;
  border: 1px solid white;
  width: 50vw;
}
#loading .progressbar {
  margin: 2px;
  background: white;
  height: 1em;
  transform-origin: top left;
  transform: scaleX(0);
}

</style>
