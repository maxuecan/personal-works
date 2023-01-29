<template>
  <div class="three-container">
    <canvas id="three-box" ref="threeBox"></canvas>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { getCurrentInstance, onMounted, nextTick, ref, reactive } from 'vue'

let { ctx } = getCurrentInstance() as any

let img = new URL('../../assets/earth.png', import.meta.url).href

let earthCube = ref()
let rotate_bol = ref(false)
let key_code = ref(0)

onMounted(async () => {
  await nextTick()
  main()
})

function createLight<T>(scene:T) {
  let color = 0xffffff
  let intensity = 1
  // let light = new THREE.AmbientLight(color, intensity) // 环境光
  let light = new THREE.DirectionalLight(color, intensity)
  light.position.set(0, 10, 0)
  light.target.position.set(-5, 0, 0)
  scene.add(light)
  scene.add(light.target)
}

function createPlane<T>(scene:T) {
  let planeSize = 40
  let loaders = new THREE.TextureLoader()
  loaders.load('https://threejs.org/manual/examples/resources/images/checker.png', (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    let repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    let planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    let planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
    let mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -.5
    scene.add(mesh)
  })
}

function main() {
  // 渲染器
  let canvas = ctx.$refs.threeBox
  let renderer = new THREE.WebGLRenderer({canvas})
  // 场景
  let scene = new THREE.Scene()
  // 相机
  let fav = 45
  let aspect = 2
  let near = 0.1
  let far = 1000
  let camera = new THREE.PerspectiveCamera(fav, aspect, near, far) as any
  camera.position.set(0, 10, 20)
  // camera.up.set(0, 0, 0)
  camera.lookAt(0, 0, 0)

  // 光源
  createLight(scene)
  // 地平面
  createPlane(scene)
  // 地球
  // {
    let radius = 1
    let widthSegments = 32
    let heightSegments = 16
    let sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)

    let loader = new THREE.TextureLoader()
    // loader.load(img, (texture) => {
    //   let earthMat = new THREE.MeshBasicMaterial({
    //     map: texture
    //   })
    //   let earthCube = new THREE.Mesh(sphereGeometry, earthMat)
    //   earthCube.position.set(-radius - 2, radius + 2, 0)
    //   scene.add(earthCube)
    // })
    let texture = loader.load(img)
    let earthMat = new THREE.MeshBasicMaterial({
      map: texture
    })
    earthCube = new THREE.Mesh(sphereGeometry, earthMat)
    earthCube.position.set(-radius - 2, radius, 0)
    scene.add(earthCube)
  // }

  // 监听窗口变化
  function resizeRendererToDisplaySize(renderer: any): Boolean {
    let canvas = renderer.domElement
    let width = canvas.clientWidth
    let height = canvas.clientHeight
    let needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }
  // 渲染
  function render(time) {
    if (rotate_bol.value) {
      if (key_code.value === 37) {
        earthCube.position.x -= 0.1
        earthCube.rotation.y += 0.1
      } else if (key_code.value === 38) {
        earthCube.position.z -= 0.1
        earthCube.rotation.x -= 0.1
      } else if (key_code.value === 39) {
        earthCube.position.x += 0.1
        earthCube.rotation.y -= 0.1
      } else if (key_code.value === 40) {
        earthCube.position.z += 0.1
        earthCube.rotation.x += 0.1
      }
    }

    if (resizeRendererToDisplaySize(renderer)) {
      let canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  document.onkeydown = function(event) {
    if (event && [37,38,39,40].includes(event.keyCode)) { // 左键 上键 右键 下键
      rotate_bol.value = true
      key_code.value = event.keyCode
    }
  }
  document.onkeyup = function(event) {
    if (event && [37,38,39,40].includes(event.keyCode)) { // 左键 上键 右键 下键
      rotate_bol.value = false
      key_code.value = event.keyCode
    }
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
