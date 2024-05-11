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
// import {
//     templateVertexShader,
//     templateFragmentShader,
//     sunNoiseVertexShader,
//     sunNoiseFragmentShader,
//     sunShapeVertexShader,
//     sunShapeFragmentShader,
//     sunRingVertexShader,
//     sunRingFragmentShader,
// } from './texture'

import { getCurrentInstance, onMounted, nextTick } from 'vue';

let { ctx } = getCurrentInstance() as any
onMounted(async () => {
    await nextTick()
    main()
})
const sunNoiseVertexShader = `
#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vPosition;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
    vPosition=position;
}
`;
const sunNoiseFragmentShader = `
#define GLSLIFY 1
//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
  }

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

#define OCTAVES 6

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vPosition;

float fbm4d(vec4 p){
    float sum=0.;
    float amp=1.;
    float scale=1.;
    for(int i=0;i<OCTAVES;i++){
        sum+=snoise(p*scale)*amp;
        p.w+=100.;
        amp*=.9;
        scale*=2.;
    }
    return sum;
}

void main(){
    vec4 p=vec4(vPosition*4.,uTime*.025);
    float noise=fbm4d(p);
    vec4 p1=vec4(vPosition*2.,uTime*.25);
    float spot=max(snoise(p1),0.);
    vec4 color=vec4(noise);
    color*=mix(1.,spot,.7);
    gl_FragColor=color;
}
`;
const sunShapeVertexShader = `
#define GLSLIFY 1
mat2 rotation2d(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat2(
		c, -s,
		s, c
	);
}

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
		oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
		0.0,                                0.0,                                0.0,                                1.0
	);
}

vec2 rotate(vec2 v, float angle) {
	return rotation2d(angle) * v;
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
}

// https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/
vec3 getEyeVector(mat4 modelMat,vec3 pos,vec3 camPos){
    vec4 worldPosition=modelMat*vec4(pos,1.);
    vec3 eyeVector=normalize(worldPosition.xyz-camPos);
    return eyeVector;
}

const float HALF_PI=1.570796327;

uniform float uTime;
uniform float uVelocity;
uniform float uStagger;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vLayer3;
varying vec3 vNormal;
varying vec3 vEyeVector;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vec3 pos=position;
    float displacement1=uVelocity*uTime;
    float displacement2=uVelocity*(uTime*1.5+uStagger*1.);
    float displacement3=uVelocity*(uTime*2.+uStagger*2.);
    vec3 xy=vec3(1.,1.,0.);
    vec3 xz=vec3(1.,0.,1.);
    vec3 yz=vec3(0.,1.,1.);
    vec3 layer1=rotate(pos,xy,displacement1);
    vec3 layer2=rotate(pos,xz,displacement2);
    vec3 layer3=rotate(pos,yz,displacement3);
    
    vUv=uv;
    vPosition=position;
    vLayer1=layer1;
    vLayer2=layer2;
    vLayer3=layer3;
    vNormal=normal;
    vEyeVector=getEyeVector(modelMatrix,position,cameraPosition);
}
`;
const sunShapeFragmentShader = `
#define GLSLIFY 1
// https://www.shadertoy.com/view/4scSW4
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.+dot(I,N),power);
}

// https://www.shadertoy.com/view/XlSSzK
vec3 firePalette(float i){
    float T=1400.+1300.*i;// Temperature range (in Kelvin).
    vec3 L=vec3(7.4,5.6,4.4);// Red, green, blue wavelengths (in hundreds of nanometers).
    L=pow(L,vec3(5.))*(exp(1.43876719683e5/(T*L))-1.);
    return 1.-exp(-5e8/L);// Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
}

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform samplerCube uNoiseTexture;
uniform float uBrightness;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vLayer3;
varying vec3 vNormal;
varying vec3 vEyeVector;

float layerSum(){
    float sum=0.;
    sum+=textureCube(uNoiseTexture,vLayer1).r;
    sum+=textureCube(uNoiseTexture,vLayer2).r;
    sum+=textureCube(uNoiseTexture,vLayer3).r;
    sum*=uBrightness;
    return sum;
}

void main(){
    float brightness=layerSum();
    brightness=4.*brightness+1.;
    float F=fresnel(0.,1.,2.,vEyeVector,vNormal);
    brightness+=F;
    brightness*=.5;
    vec4 color=vec4(firePalette(brightness),1.);
    gl_FragColor=color;
}
`;
const sunRingVertexShader = `
#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vPosition;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
    vPosition=position;
}
`;
const sunRingFragmentShader = `
#define GLSLIFY 1

float invert(float n){
    return 1.-n;
}

vec3 invert(vec3 n){
    return 1.-n;
}

// https://www.shadertoy.com/view/XlSSzK
vec3 firePalette(float i){
    float T=1400.+1300.*i;// Temperature range (in Kelvin).
    vec3 L=vec3(7.4,5.6,4.4);// Red, green, blue wavelengths (in hundreds of nanometers).
    L=pow(L,vec3(5.))*(exp(1.43876719683e5/(T*L))-1.);
    return 1.-exp(-5e8/L);// Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
}

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vPosition;

void main(){
    float radial=invert(vPosition.z);
    radial=pow(radial,3.);
    float brightness=(1.+radial*.83)*radial*.4;
    vec3 ringColor=firePalette(brightness);
    vec4 color=vec4(ringColor,radial);
    gl_FragColor=color;
}
`;

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
    renderer.shadowMap.enabled = true
    renderer.outputEncoding = THREE.LinearEncoding
    // renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    // 相机
    // let fov = 40 // 视角
    // let aspect = window.innerWidth / window.innerHeight // 视宽比
    // let near = 0.1 // 进
    // let far = 1000 // 远
    // let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    // camera.position.set(0, 10, 20) // x y z
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.copy(new THREE.Vector3(0, 3, 10))
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // 控制器
    let controls = new OrbitControls(camera, canvas)
    // controls.enableZoom = false // 是否可以缩放
    // controls.enablePan = false // 启用或禁用摄像机平移
    // controls.enableRotate = false // 是否启用旋转功能
    // controls.minPolarAngle = Math.PI / 3
    // controls.maxPolarAngle = Math.PI / 2.05

    // controls.target = new THREE.Vector3(0, 1, 0)
    // controls.object.position.set(0, 2, -4)
    controls.target.copy(new THREE.Vector3(0, 0, 0))
    controls.update()

    // 纹理
    let _texture = new URL('../../assets/texture/venice_sunset_1k.hdr', import.meta.url).href

    // 场景
    let scene = new THREE.Scene()
    scene.background = new THREE.Color('#000000')
    scene.environment = new RGBELoader().load(_texture)
    scene.environment.mapping = THREE.EquirectangularReflectionMapping
    // scene.fog = new THREE.Fog(0x333333, 10, 15)

    // 添加地板网格
    let SphereGemoetry = new THREE.SphereGeometry(1, 20, 20)
    let meterial = new THREE.MeshPhongMaterial({
        color: 0xffffffff
    })

    let sphere = new THREE.Mesh(SphereGemoetry, meterial)
    sphere.castShadow = true

    let PlaneGeometry = new THREE.PlaneGeometry(50, 50)
    let plane = new THREE.Mesh(PlaneGeometry, meterial)
    plane.position.set(0, -1, 0)
    plane.rotation.x = -Math.PI/2
    plane.receiveShadow = true
    scene.add(plane)
    scene.add(sphere)
    scene.add(createGrid())

    // let axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)
    // 环境光
    // {
    //     const skyColor = 0xB1E1FF // 天空
    //     const groundColor = 0xB97A20 // 地面
    //     const intensity = 2 // 光强
    //     const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    //     scene.add(light)
    // }

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

    // 太阳
    // let smallBall = new THREE.Mesh(
    //     new THREE.SphereGeometry(0.1, 20, 20),
    //     new THREE.MeshBasicMaterial({color: 0xff0000})
    // )
    // let pointLight = new THREE.PointLight(0x666666, 1)
    // pointLight.castShadow = true
    // pointLight.intensity = 3
    // smallBall.add(pointLight)
    // smallBall.position.set(0, 4, 0)
    // scene.add(smallBall)

    const position = new THREE.Vector3(0, 0, 0)

    // 创建噪声材质
    const sunNoiseMaterial = new THREE.ShaderMaterial({
        vertexShader: sunNoiseVertexShader,
        fragmentShader: sunNoiseFragmentShader,
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0
            },
            uMouse: {
                value: new THREE.Vector2(0, 0)
            },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
        }
    });
    // 创建立方体离屏渲染目标，将其作为太阳本体的噪声贴图
    const cubeRt = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRt);
    const cubeScene = new THREE.Scene();
    const geometry = new THREE.SphereBufferGeometry(1, 100, 100);
    const sunNoisegeometryMesh = new THREE.Mesh(geometry, sunNoiseMaterial);
    sunNoisegeometryMesh.position.copy(position);
    cubeScene.add(sunNoisegeometryMesh);

    // 创建太阳本体材质
    const sunShapeMaterial = new THREE.ShaderMaterial({
        vertexShader: sunShapeVertexShader,
        fragmentShader: sunShapeFragmentShader,
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0
            },
            uMouse: {
                value: new THREE.Vector2(0, 0)
            },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            },
            uNoiseTexture: {
                value: null
            },
            uVelocity: {
                value: 0.05
            },
            uBrightness: {
                value: 0.33
            },
            uStagger: {
                value: 16
            }
        }
    });
    // 创建太阳
    const sunMesh = new THREE.Mesh(geometry, sunShapeMaterial)
    sunMesh.position.copy(position)
    scene.add(sunMesh)

    // 创建太阳环材质
    const sunRingMaterial = new THREE.ShaderMaterial({
        vertexShader: sunRingVertexShader,
        fragmentShader: sunRingFragmentShader,
        side: THREE.BackSide,
        uniforms: {
            uTime: {
                value: 0
            },
            uMouse: {
                value: new THREE.Vector2(0, 0)
            },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
        }
    });
    // 创建太阳环
    const sunRingGeometry = new THREE.SphereBufferGeometry(1.2, 100, 100);
    const sunRingMesh = new THREE.Mesh(sunRingGeometry, sunRingMaterial)
    sunRingMesh.position.copy(position)
    scene.add(sunRingMesh)

    // 创建光源
    let dirLight = new THREE.DirectionalLight(new THREE.Color('#ffffff'), 0.5)
    dirLight.position.set(0, 50, 0)
    scene.add(dirLight)
    let ambiLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.4)
    scene.add(ambiLight)

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
        // let time = clock.getElapsedTime()
        // smallBall.position.x = Math.sin(time) * 5
        // smallBall.position.y = Math.cos(time) * 5

        TWEEN.update()

        let elapsedTime = clock.getElapsedTime()
        let mousePos = new THREE.Vector2(0, 0)
        if (sunNoiseMaterial && sunShapeMaterial) {
            cubeCamera.update(renderer, cubeScene)
            sunNoiseMaterial.uniforms.uTime.value = elapsedTime;
            sunNoiseMaterial.uniforms.uMouse.value = mousePos;
            sunShapeMaterial.uniforms.uTime.value = elapsedTime;
            sunShapeMaterial.uniforms.uMouse.value = mousePos;
            sunShapeMaterial.uniforms.uNoiseTexture.value = cubeRt.texture;
            sunRingMaterial.uniforms.uTime.value = elapsedTime;
            sunRingMaterial.uniforms.uMouse.value = mousePos;
        }

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
    // function clickEffect() {
	// 	var textures = [];
	// 	var index = 0;
	// 	var clickEffectMesh;

	// 	var loader = new THREE.ImageLoader();
    //     let stop = new URL('../../assets/spotd.png', import.meta.url).href
	// 	loader.load(stop, function(image) {
	// 		let canvas, context, geometry, material, plane;
	// 		let w = image.width;
	// 		let num = image.height / image.width;

	// 		for (let i = 0; i < num; i++) {
	// 			textures[i] = new THREE.Texture();
	// 		}

	// 		for (let i = 0; i < num; i++) {
	// 			canvas = document.createElement('canvas');
	// 			context = canvas.getContext('2d');
	// 			canvas.height = w;
	// 			canvas.width = w;
	// 			context.drawImage(image, 0, w * i, w, w, 0, 0, w, w);
	// 			textures[i].image = canvas;
	// 			textures[i].needsUpdate = true;
	// 		}

	// 		geometry = new THREE.PlaneGeometry(1, 1);
	// 		material = new THREE.MeshBasicMaterial({
	// 			map: textures[0],
	// 			transparent: true,
	// 			side: THREE.DoubleSide,
	// 		});

	// 		clickEffectMesh = new THREE.Mesh(geometry, material);
	// 		clickEffectMesh.rotateX(Math.PI / 2);
	// 		clickEffectMesh.visible = false;

	// 		scene.add(clickEffectMesh);
	// 	});

	// 	this.effect = function(x, y, z) {
	// 		clickEffectMesh.visible = true;
	// 		clickEffectMesh.position.set(x, y, z);
	// 		let id = setInterval(function() {
	// 			if (index == 10) {
	// 				index = 0;
	// 				clickEffectMesh.visible = false;
	// 				clearInterval(id);
	// 			}
	// 			clickEffectMesh.material.map = textures[index];
	// 			index++;
	// 		}, 20)
	// 	}
	// }
    // clickEffectObj = new clickEffect()

    // 监听单机拾取对象初始化球体
    // document.addEventListener('click', pickupObjects, false)

    requestAnimationFrame(render)
}

/* 创建地板网格 */
function createGrid() {
    let grid = new THREE.GridHelper(200, 400, 0xffffff, 0xffffff)
    grid.material.opacity = 0.2
    grid.material.depthWrite = false
    grid.material.transparent = true
    grid.receiveShadow = true
    return grid
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
