/*  
* 插件/框架
*/
const plugsRouter = {
    path: '/plugs',
    children: [
        {
            path: '/plugs',
            name: 'Plugs',
            component: () => import('@/views/plugs/index.vue')
        },
        {
            path: '/plugs/element',
            name: 'Element',
            component: () => import('@/views/plugs/element/index.vue')
        },
        {
            path: '/plugs/imageLazyLoading',
            name: 'IamgeLazyLoading',
            component: () => import('@/views/plugs/imageLazyLoading/index.vue')
        },
        {
            path: '/plugs/jszip',
            name: 'Jszip',
            component: () => import('@/views/plugs/jszip/index.vue')
        }
    ]
}
  
export default plugsRouter
