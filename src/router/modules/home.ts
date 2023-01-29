const homeRouter = {
  path: '/home',
  component: () => import('@/views/home/index.vue'),
  children: [
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/index.vue')
    }
  ]
}

export default homeRouter
