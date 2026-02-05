# 渲染器

```
THREE.WebGLRenderer({})
常用属性:
antialias // 是否执行坑锯齿
alpha // 画布是否包含（透明度）缓冲区
premultipliedAlpha // 渲染器是否会假设颜色具有 预乘alpha
autoClear // 定义渲染器是否应在渲染帧之前自动清除其输出
```

# 相机

```
THREE.PerspectiveCamera(fov, aspect, near, far)
fov // 视野范围
aspect // 画布的宽高比
near // 近平面
far // 远平面
```

# 场景

```
THREE.Scene()
.add(网格)
```

# 控制器

```
new OrbitControls()
```



# 几何体

```
THREE.BoxGeometry()
```

# 材质

```
THREE.MeshBasicMaterial()
```

# 网格

```
THREE.Mesh(geometry, material)
```





## 灯光

```
THREE.DirectionalLight()
THREE.AmbientLight() // 
THREE.HemisphereLight() // 点光源
THREE.SpotLight() // 聚光灯
THREE.RectAreaLight() // 短形区域光
```

## 纹理

```
加载单个纹理
THREE.TextureLoader(source, function(texture){})
方法：
load(url, (texture) => {})

加载多个纹理
THREE.LoadingManager()
THREE.LoadingManager().onLoad = () => {}
THREE.LoadingManager().onProgress = () => {}
THREE.TextureLoader(
	THREE.LoadingManager()
)

texture常用属性:
generateMipmaps // 是否为纹理生成mipmap
wrapS // 贴图在水平方向上将如何包裹
wrapT // 贴图在垂直方向上将如何包裹
minFilter // 一个纹素覆盖小于一个像素时，贴图将如何采样
colorSpace
```







### 三维空间

```
THREE.Object3D()
```

### 辅助工具

```
new AxisGirdHelper()
```

### THREE.DoubleSide()

```
控制几何体表面的渲染面

1. 双面渲染
默认情况下，Three.js 只渲染几何体的正面（法线朝外的面）
设置为 THREE.DoubleSide后，正反两面都会被渲染
```

