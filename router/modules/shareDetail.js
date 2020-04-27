/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const shareDetailRouter = {
  path: '/shareDetail',
  component: Layout,
  redirect: '/shareDetail/index',
  name: '个股详情',
  meta: {
    title: '个股详情',
    icon: 'nested'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/shareDetail/index'),
      name: '详情',
      meta: { title: '详情' }
    }
  ]
}
export default shareDetailRouter
