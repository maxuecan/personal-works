# 渲染器

```
THREE.WebGLRenderer({})
常用属性:
antialias // 是否执行坑锯齿
alpha // 画布是否包含（透明度）缓冲区
premultipliedAlpha // 渲染器是否会假设颜色具有 预乘alpha
autoClear // 定义渲染器是否应在渲染帧之前自动清除其输出
```

# 纹理

```
THREE.TextureLoader(source, function(texture){})
texture常用属性:
generateMipmaps // 是否为纹理生成mipmap
wrapS // 贴图在水平方向上将如何包裹
wrapT // 贴图在垂直方向上将如何包裹
minFilter // 一个纹素覆盖小于一个像素时，贴图将如何采样
```

