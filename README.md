作品地址：maxuecan.github.io

内容包含：
vue3+ts使用
canvas使用
css世界内容
工作中内容记录

ui库：https://uiverse.io/

eslint
安装eslint：npm i eslint -D
初始化eslint：npx eslint --init
1，模式：To check syntax and find problems(检查语法并查找问题)
2，选中语言模块：JavaScript modules (import/export)
3，旋转语言框架：Vue.js
4，是否使用ts：yes
5，代码在哪里运行：none
6，配置文件格式：JavaScript
7，是否现在安装：yes
8，包管理器：npm
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


vscode插件
# px to rem & rpx & vw 像素转化
# open in browser 打开浏览器
# prettier 代码格式化
# vue-official 代码检查

js插件
# autofit.js 自适应页面尺寸（App.vue）

我的世界资源
# https://free3d.com/zh/3d-model/lamborghini-aventador-sport-44634.html

借鉴作品
# 人物运动:https://juejin.cn/post/7354948943912370214?searchId=2024040808341064FB8BAF7BE5D94974CD
# 人物运动:https://juejin.cn/post/7351642274273918986?searchId=2024040808341064FB8BAF7BE5D94974CD
# 左本项目 http://zuoben.top/pages/resource/

场景资源
# https://polyhaven.com/zh/hdris

解决方案
http下浏览器调用设备权限
# https://blog.csdn.net/anzhenxi3529/article/details/121624415 

blender教程
# https://i.youku.com/u/UMTgzMTA0NDc2MA
# https://docs.blender.org/manual/zh-hans/latest/interface/window_system/workspaces.html


主题且黄
# https://juejin.cn/post/7042605241023332389?from=search-suggest
# https://juejin.cn/post/7049384448256639006?from=search-suggest
# https://blog.csdn.net/Echocyd/article/details/106350793
# https://juejin.cn/post/7341797865108766746?from=search-suggest#heading-3