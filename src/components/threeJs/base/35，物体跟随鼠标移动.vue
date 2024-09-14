<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { getCurrentInstance,  onMounted, nextTick, ref } from 'vue'
import { linev, linef } from '../shaders/line.js'
import { sparklev, sparklef } from '../shaders/sparkle.js'
// import { lights } from 'three/examples/jsm/nodes/lighting/LightsNode'

let { ctx } = getCurrentInstance() as any

onMounted(async () => {
    await nextTick()
    main()
})

let vec3 = function(x, y, z) {
    return new THREE.Vector3(x, y, z)
}

function main() {
    let lineExpFactor = 0.6
    let speedExpFactor = 0.8
    let lineSize = 0.15
    let opacityDecrement = 0.55
    let sparklesCount = 65
    let maxOpacity = 1

    let linePoints  = [];
    let sparkles = [];
    let lightShafts = [];
    let aspectRatio = innerWidth / innerHeight;

    let mouseDown = false
    let mouseMixer = 0

    let cumulativeUvy = 0

    let textureDisp  = new THREE.Vector2(0, 0);
    let lastTextureDisp = new THREE.Vector2(0, 0);

    let currMousePos = vec3(0,0,0);
    let lastMousePos = vec3(0,0,0);

    // 材质
    let lineMaterial;
    let sparkleMaterial;

    let canvas = ctx.$refs.threeBox
    // 渲染器
    let renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true, // 画布是否包含（透明度）缓冲区
        premultipliedAlpha: true, // 渲染器是否会假设颜色
        canvas
    })
    renderer.autoClear = false

    // 场景
    let scene = new THREE.Scene()

    // 相机
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    // camera.position.z = 2
    camera.position.set(0, 0, 60)

    // 时间跟踪对象
    let clock = new THREE.Clock()

    // 纹理加载
    let t1, t2, t4;
    let t3 = new URL('../source/img/t3.jpg', import.meta.url).href
    let t6_1 = new URL('../source/img/t6_1.jpg', import.meta.url).href
    let ts = new URL('../source/img/ts.png', import.meta.url).href
    new THREE.TextureLoader().load(t3, function(texture) {
        texture.generateMipmaps = false
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
        texture.minFilter = THREE.LinearFilter;
        t1 = texture
        onDl()
    })
    new THREE.TextureLoader().load(t6_1, function(texture) {
        texture.generateMipmaps = false
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
        texture.minFilter = THREE.LinearFilter;
        t2 = texture
        onDl()
    })
    new THREE.TextureLoader().load(ts, function(texture) {
        t4 = texture
        onDl()
    })

    function onDl() {
        if(!t1 || !t2 || !t4) return;

        let linef2 = linef.replace(
            "float t = 2.5 - pow(vFx.x, 0.5) * 2.7;",
            "float t = 2.5 - pow(vFx.x, 0.5) * " + (2.7 * maxOpacity).toFixed(2) + ";",
        )

        lineMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) },
                uUVYheadStart: { value: 0 },
                uUVYheadLength: { value: 0 },
                uCumulativeY: { value: 0 },
                uTexture1: { type: "t", value: t1 },
                uTexture2: { type: "t", value: t2 },
                uPass: { value: 0 },
                uMouseTextureDisp: { value: new THREE.Vector2(0, 0) },
            },
            side: THREE.DoubleSide,
            transparent: true,
            
            depthTest: false,
            
            vertexShader: linev,
            fragmentShader: linef2,
        })

        sparkleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) },
                uTexture1: { type: "t", value: t1 },
                uTexture2: { type: "t", value: t2 },
                uTexture3: { type: "t", value: t4 },
            },
    
            side: THREE.DoubleSide,
            transparent: true,
            
            depthTest: false,
            
            vertexShader: sparklev,
            fragmentShader: sparklef,
        })

        window.addEventListener('mousemove', onMouseMove)
        clock.start();
        animate();
    }

    window.addEventListener('mousedown', function() {
        mouseDown = true
    })
    window.addEventListener('mouseup', function() {
        mouseDown = false
    })

    // 适配
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

    function onMouseMove(e) {
        let ux = (e.clientX / innerWidth) * 2 - 1;
        let uy = ((innerHeight - e.clientY) / innerHeight) * 2 - 1;
        let v = vec3(ux * aspectRatio, uy, 0);
        currMousePos = v;
        lastTextureDisp = new THREE.Vector2(ux, uy);
    }
    window.addEventListener('mousemove', onMouseMove, false);

    let followCumulative = 0;
    let velocityExp = 0;

    function render(now) {
        if (resizeRendererToDisplaySize(renderer)) {
            let canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.height
            camera.updateProjectionMatrix()
        }

        now *= 0.001

        let delta = clock.getDelta()
        let time = clock.getElapsedTime()

        followCumulative = followCumulative * 0.92 + cumulativeUvy * 0.08
        if (isNaN(followCumulative)) followCumulative = 0
        followCumulative = Math.min(followCumulative, cumulativeUvy - 0.1)

        lineMaterial.uniforms.uTime.value = time
        lineMaterial.uniforms.uUVYheadStart.value  = followCumulative; // cumulativeUvy - 0.1;
        lineMaterial.uniforms.uUVYheadLength.value = cumulativeUvy - followCumulative; //0.1;
        lineMaterial.uniforms.uCumulativeY.value   = cumulativeUvy; //0.1;

        if (mouseDown) {
            mouseMixer += delta * 10
            mouseMixer = Math.min(mouseMixer, 1)
        } else {
            mouseMixer -= delta * 10
            mouseMixer = Math.max(mouseMixer, 0)
        }

        let atd = 0.01
        textureDisp = textureDisp.clone().multiplyScalar(1 - atd).add(lastTextureDisp.clone().multiplyScalar(atd))
        lineMaterial.uniforms.uMouseTextureDisp.value = textureDisp

        let a = lineExpFactor

        let minDistBeforeActivation = 0.00;

        let newPos = vec3(
            currMousePos.x * a + lastMousePos.x * (1 - a),
            currMousePos.y * a + lastMousePos.y * (1 - a),
            currMousePos.z * a + lastMousePos.z * (1 - a)
        )

        let dist = lastMousePos.distanceTo(newPos)
        velocityExp = velocityExp * speedExpFactor + dist * (1 - speedExpFactor)

        if (dist > minDistBeforeActivation) {
            cumulativeUvy += dist
            if (isNaN(cumulativeUvy)) cumulativeUvy = 0

            if (linePoints.length === 0) {
                newPos = currMousePos
                velocityExp = 0
            }

            let velocityOpacity = Math.min(velocityExp * 40, 1)
            linePoints.push({
                v: newPos,
                opacity: 1,
                velocityOpacity: velocityOpacity,
                uvy: cumulativeUvy,
                mouseMixer: mouseMixer
            })

            let num = Math.floor((dist + 0.01) * sparklesCount)
            let rs = 5
            let sparkleBackDir = lastMousePos.clone().sub(newPos).normalize().multiplyScalar(0.1)
            for (let i = 0; i < num; i++) {
                sparkles.push({
                    v: newPos.clone().add(vec3(Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1, 0)),
                    opacity: 0.8 * velocityOpacity,
                    mouseMixer: mouseMixer,
                    vel: lastMousePos.clone().add(newPos).normalize().add(vec3(Math.random() * -rs + rs * 0.5, Math.random() * - rs + rs * 0.5, Math.random() * - rs + rs * 0.5)).multiplyScalar(0.0025),
                    size: 0.0025 + Math.random() * 0.01
                })

                lastMousePos = newPos
            }
        }

        updateOpacity(delta)
        constructSparkleGeometry()
        constructGeometry()

        requestAnimationFrame(render)
        renderer.render(scene, camera)
    }

    function updateOpacity(delta) {
        for (let linePoint of linePoints) {
            linePoint.opacity -= delta * opacityDecrement
        }

        linePoints = linePoints.filter((e, i) => {
            if (linePoints.length > (i + 1)) {
                return e.opacity > -0.2 || linePoints[i + 1].opacity > -0.2
            }
            return e.opacity > -.2
        })

        for (let sparkle of sparkles) {
            sparkle.opacity -= delta * opacityDecrement * 1.54
        }
        sparkles = sparkles.filter((e) => e.opacity > 0)

        for (let lightShaft of lightShafts) {
            lightShaft.opacity -= delta * 1.385
        }
        lightShafts = lightShafts.filter((e) => e.opacity > 0)
    }

    function constructSparkleGeometry() {
        // update velocities
        for(let i = 0; i < sparkles.length - 1; i++) {
            let sparkle = sparkles[i];
            sparkle.vel.x *= 0.97;
            sparkle.vel.y *= 0.97;

            sparkle.v.add(sparkle.vel);
        }

        // construct geometry
        let vertices = [];
        let fxs = [];
        for(let i = 0; i < sparkles.length - 1; i++) {
            let sparkle = sparkles[i];
            let v = sparkle.v;
            let mm = sparkle.mouseMixer;
            let size = sparkle.size;

            let opacity = sparkle.opacity;
            if(opacity > 0.7) {
                opacity = 1 - (opacity - 0.7) / 0.3;
            } else {
                opacity = (opacity / 0.7);            
            }

            opacity *= 0.7;

            vertices.push(v.x, v.y, v.z);
            fxs.push(opacity, mm, size, 0);
        }


        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        geometry.setAttribute( 'fx', new THREE.BufferAttribute( new Float32Array(fxs), 4 ) );
        let mesh = new THREE.Points( geometry, sparkleMaterial );
        mesh.name = "sparkles";

        let prevMesh = scene.getObjectByName("sparkles");
        if(prevMesh) {
            scene.remove(prevMesh);
        }

        scene.add(mesh);
    }

    function constructGeometry() {
        // this has to run at the beginning of the function otherwise we run the risk of never deleting stale lines
        let prevMesh = scene.getObjectByName("line");
        if(prevMesh) {
            scene.remove(prevMesh);
        }

        // this if-statement might need a modification to solve TODO .1
        if(linePoints.length < 3) return;

        let newPoints = []
        function CubicInterpolate(y0, y1, y2, y3, mu) {
            let a0,a1,a2,a3,mu2;
        
            mu2 = mu*mu;
        
            a0 = -0.5*y0 + 1.5*y1 - 1.5*y2 + 0.5*y3;
            a1 = y0 - 2.5*y1 + 2*y2 - 0.5*y3;
            a2 = -0.5*y0 + 0.5*y2;
            a3 = y1;

            return(a0*mu*mu2+a1*mu2+a2*mu+a3);
        }

        // create fake first element if necessary
        linePoints.splice(0, 0, {
            v: linePoints[0].v.clone().add(  linePoints[1].v.clone().sub(linePoints[0].v).normalize().multiplyScalar(-0.02)  ),
            opacity: linePoints[0].opacity,
            velocityOpacity: linePoints[0].velocityOpacity,
        });

    
        // cube spline new points
        for(let i = 1; i < linePoints.length-2; i++) {
            let p0 = linePoints[i-1].v;
            let p1 = linePoints[i].v;
            let p2 = linePoints[i+1].v;
            let p3 = linePoints[i+2].v;

            let n0 = p0.clone().sub(p1).normalize();
            let n1 = p1.clone().sub(p2).normalize();
            let n2 = p2.clone().sub(p3).normalize();

            let uvy1 = linePoints[i].uvy;
            let uvy2 = linePoints[i+1].uvy;
            
            let vo1 = linePoints[i].velocityOpacity;
            let vo2 = linePoints[i+1].velocityOpacity;

            let mm1 = linePoints[i].mouseMixer;
            let mm2 = linePoints[i+1].mouseMixer;

            let dot1 = n0.dot(n1);
            let dot2 = n0.dot(n2);
            let biggestProblematicDot = dot1 < dot2 ? dot1 : dot2;

            let dotT = ((biggestProblematicDot * -1) + 1) / 2;

            let o0 = linePoints[i].opacity;
            let o1 = linePoints[i+1].opacity;

            let segments = Math.max(30 * dotT, 1);

            // these two lines below seems to solve a very obscure bug that drove me crazy for 2 hours
            let js = 1;
            if(i===1) js = 0;
            
            for(let j = js; j <= segments; j++) {
                let mu = j / segments;

                let x = CubicInterpolate(p0.x, p1.x, p2.x, p3.x, mu);
                let y = CubicInterpolate(p0.y, p1.y, p2.y, p3.y, mu);
                
                let o = o0 * (1-mu) + o1 * mu; 

                newPoints.push({
                    v: vec3(x, y, 0),
                    opacity: o,
                    velocityOpacity: vo1 * (1-mu) + vo2 * mu,
                    uvy: uvy1 * (1-mu) + uvy2 * mu,
                    mouseMixer: mm1 * (1-mu) + mm2 * mu,
                });

            }
        }

        // delete fake first element
        linePoints.shift();        


        // compute initially intermediary normals, the normals at the begin and the end of the trail will be handled separately
        for(let i = 1; i < newPoints.length - 1; i++) {
            let p0 = newPoints[i-1].v;
            let p1 = newPoints[i].v;
            let p2 = newPoints[i+1].v;

            let pn = p0.clone().sub(p2).normalize();
            let n = vec3(-pn.y, pn.x, 0);
            newPoints[i].n = n;
        }

        // tail normal
        {
            let p0 = newPoints[0].v;
            let p1 = newPoints[1].v;

            let pn = p0.clone().sub(p1).normalize();
            let n = vec3(-pn.y, pn.x, 0);
            newPoints[0].n = n;
        }
        
        // head normal
        {
            let p0 = newPoints[newPoints.length - 2].v;
            let p1 = newPoints[newPoints.length - 1].v;

            let pn = p0.clone().sub(p1).normalize();
            let n = vec3(-pn.y, pn.x, 0);
            newPoints[newPoints.length - 1].n = n;
        }
        
        
        // construct geometry
        let vertices = [];
        let uvs = [];
        let fxs = [];
        for(let i = 0; i < newPoints.length - 1; i++) {
            let p1 = newPoints[i].v;
            let p2 = newPoints[i+1].v;

            let mm1 = newPoints[i].mouseMixer;
            let mm2 = newPoints[i+1].mouseMixer;

            let uvy1 = newPoints[i].uvy;
            let uvy2 = newPoints[i+1].uvy;
            
            let n1 = newPoints[i].n;
            let n2 = newPoints[i+1].n;

            let v1 = vec3(0,0,0);
            let v2 = vec3(0,0,0);
            let v3 = vec3(0,0,0);
            let v4 = vec3(0,0,0);

            
            v1.copy(p1.clone().sub(n1.clone().multiplyScalar(lineSize)));
            v2.copy(p1.clone().add(n1.clone().multiplyScalar(lineSize)));

            v3.copy(p2.clone().sub(n2.clone().multiplyScalar(lineSize)));
            v4.copy(p2.clone().add(n2.clone().multiplyScalar(lineSize)));


            let lineDirv1 = v3.clone().sub(v1);
            let lineDirv2 = v4.clone().sub(v2);
            let lineDirv3 = v3.clone().sub(v1);
            let lineDirv4 = v4.clone().sub(v2);
            if(i < newPoints.length - 2) {
                let v5 = vec3(0,0,0);
                let v6 = vec3(0,0,0);
                v5.copy(newPoints[i+2].v.clone().sub(newPoints[i+2].n.clone().multiplyScalar(lineSize)));
                v6.copy(newPoints[i+2].v.clone().add(newPoints[i+2].n.clone().multiplyScalar(lineSize)));

                lineDirv3 = v5.clone().sub(v3);
                lineDirv4 = v6.clone().sub(v4);
            }


            vertices.push(v1.x, v1.y, v1.z);
            vertices.push(v2.x, v2.y, v2.z);
            vertices.push(v3.x, v3.y, v3.z);

            vertices.push(v2.x, v2.y, v2.z);
            vertices.push(v3.x, v3.y, v3.z);
            vertices.push(v4.x, v4.y, v4.z);

            uvs.push(1, uvy1);
            uvs.push(0, uvy1);
            uvs.push(1, uvy2);

            uvs.push(0, uvy1);
            uvs.push(1, uvy2);
            uvs.push(0, uvy2);

            fxs.push(newPoints[i].opacity   * newPoints[i].velocityOpacity  ,   mm1, lineDirv1.x, lineDirv1.y);
            fxs.push(newPoints[i].opacity   * newPoints[i].velocityOpacity  ,   mm1, lineDirv2.x, lineDirv2.y);
            fxs.push(newPoints[i+1].opacity * newPoints[i+1].velocityOpacity, mm2, lineDirv3.x, lineDirv3.y);

            fxs.push(newPoints[i].opacity   * newPoints[i].velocityOpacity  ,   mm1, lineDirv2.x, lineDirv2.y);
            fxs.push(newPoints[i+1].opacity * newPoints[i+1].velocityOpacity, mm2, lineDirv3.x, lineDirv3.y);
            fxs.push(newPoints[i+1].opacity * newPoints[i+1].velocityOpacity, mm2, lineDirv4.x, lineDirv4.y);

        }


        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        geometry.setAttribute( 'fx', new THREE.BufferAttribute( new Float32Array(fxs), 4 ) );
        geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(uvs), 2 ) );
        let mesh = new THREE.Mesh( geometry, lineMaterial );
        mesh.name = "line";

        
        scene.add(mesh);

        // if(window.maxv === undefined) window.maxv = 0;
        // if(window.maxv < (vertices.length / 3)) {
        //     window.maxv = vertices.length / 3;
        //     console.log(window.maxv);
        // }
    }

    function animate() {
        requestAnimationFrame(render)   
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
