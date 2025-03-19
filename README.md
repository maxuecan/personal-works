# 作品地址：maxuecan.github.io

## 内容包含：

```
1. vue3+ts使用
2. canvas使用
3. css世界内容
4. 工作中内容记录
```

## ui库：https://uiverse.io/

## eslint

```
安装eslint：npm i eslint -D
初始化eslint：npx eslint --init

1. 模式：To check syntax and find problems(检查语法并查找问题)
2. 选中语言模块：JavaScript modules (import/export)
3. 旋转语言框架：Vue.js
4. 是否使用ts：yes
5. 代码在哪里运行：none
6. 配置文件格式：JavaScript
7. 是否现在安装：yes
8. 包管理器：npm

前面安装完成会生成.eslintrc.js文件
.eslintgnore：用于过滤不需要校验的文件

安装vite-plugin-eslint(该包用于配置vite运行的时候自动检测eslint规范)：npm i vite-plugin-eslint -D
安装prettier（用于规范代码格式，不需要不装）
npm i prettier -D
npm i eslint-config-prettier -D // eslint兼容插件
npm i eslint-plugin-prettier -D // eslint的prettier

配置vite.config.js.ts文件
(
  import eslintPlugin from 'vite-plugin-eslint'
  eslintPlugin({
    include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue']
  }),
)
简书：https://blog.csdn.net/qq_53225741/article/details/127113104
```

## vscode插件

```
px to rem & rpx & vw (像素转化)
open in browser (打开浏览器)
prettier (代码格式化)
vue-official (代码检查)
```

## js插件

```
autofit.js 自适应页面尺寸（App.vue）

codeMirror 代码编辑器
https://github.com/codemirror/codemirror5
https://codemirror.net/5/demo/search.html

xterm 终端
https://github.com/xtermjs/xterm.js
https://www.javascriptcn.com/post/33698

fabricjs canvas库
https://fabricjs.com/

ajv JSON校验
https://ajv.js.org/

Css sprites
https://www.toptal.com/developers/css/sprite-generator

jszip 压缩
https://www.softaculous.com/apps/js/libraries/JSZip
http://docs.asprain.cn/jszip/jszip.html
https://stuk.github.io/jszip/

jsTree 
https://www.jstree.com/api/#/

https://help.fanruan.com/finereport/doc-view-1178.html
```

## Three.js资源

```
https://free3d.com/zh/3d-model/lamborghini-aventador-sport-44634.html

借鉴作品:
人物运动:https://juejin.cn/post/7354948943912370214?searchId=2024040808341064FB8BAF7BE5D94974CD

人物运动:https://juejin.cn/post/7351642274273918986?searchId=2024040808341064FB8BAF7BE5D94974CD

左本项目 http://zuoben.top/pages/resource/ 

小车运动:https://juejin.cn/post/7350181789531373619?searchId=20240328114158E0986DEB274115E98DC4

https://gltf-viewer.donmccurdy.com/
```

## Three.js场景资源

```
https://polyhaven.com/zh/hdris

https://sketchfab.com/
```

## 常见问题处理，以及解决方案

```
http下浏览器调用设备权限
https://blog.csdn.net/anzhenxi3529/article/details/121624415 
```

## blender教程

```
https://i.youku.com/u/UMTgzMTA0NDc2MA

https://docs.blender.org/manual/zh-hans/latest/interface/window_system/workspaces.html
```

## 主题切换案例

```
# https://juejin.cn/post/7042605241023332389?from=search-suggest

# https://juejin.cn/post/7049384448256639006?from=search-suggest

# https://blog.csdn.net/Echocyd/article/details/106350793

# https://juejin.cn/post/7341797865108766746?from=search-suggest#heading-3
```

## 代码规范

```
https://juejin.cn/post/6893891476913291278?searchId=20240522153147D05921574B41967E0E69
```

## ios app 发布

```
https://zhuanlan.zhihu.com/p/677066528
```

## 手写nextTick

```
# https://juejin.cn/post/7399530640860643380
```

## 稀土文章

```
https://juejin.cn/post/7361720687956459531 

模型加载，骨骼运动
# https://juejin.cn/post/7272571989821784123 

gltf模型检查
https://gltf-viewer.donmccurdy.com/
```

## git大文件上传

```
git lfs track "*."
git add .
git commit -m ""
git push
```
## git取消提交

```
git reset --soft HEAD^
```

## 若一

```
https://gitee.com/tony2y/RuoYi-flowable#https://gitee.com/link?target=http%3A%2F%2Fopen.tony2y.top
```

## 阮一峰

```
https://es6.ruanyifeng.com/#docs/promise
```

## Electron

```
http://blog.tomyres.com/archives/abae80ef.html
```

## 单点

```
https://casdoor.org/zh/docs/application/config
https://casdoor.org/zh/docs/how-to-connect/sdk/
```

## SVG在线生成

```
https://www.bejson.com/ui/svg_editor/#google_vignette
```

## 服务端监控

```
https://juejin.cn/post/7123518368631652382
```

## Scratch文章

```
https://github.com/shownb/shownb.github.com/issues/36

https://read.douban.com/reader/ebook/162934827/?dcs=ebook

https://github.com/LLK/scratch-gui

https://summerscar.me/2021/07/01/%E6%8F%92%E4%BB%B6%E7%BC%96%E5%86%99%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97/

https://github.com/scratchfoundation/scratch-vm/blob/develop/docs/extensions.md
```

## 图像压缩

```
https://tinify.cn/
```

### GLB文件压缩

```
glTF-Pipeline: 一个Node.js命令行工具，可以用来优化和压缩GLB文件。
gltfpack: 一个高效的glTF压缩工具，可以显著减小文件大小。
glTF-Optimizer: 一个Web工具，可以在浏览器中优化glTF/GLB文件。
```

### package.json与.env关系

```
"script": {
	"div": "vite", // .env.development
	"build": "vite build", // .env.production
	"build:cloud": "vite build --mode cloud" // .env.cloud
}
.env 在vite项目，以VITE_做为标识
```

