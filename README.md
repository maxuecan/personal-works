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
  import eslintPlugin from 'vite-plugin-compression'
  eslintPlugin({
    include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue']
  }),
)
简书：https://blog.csdn.net/qq_53225741/article/details/127113104