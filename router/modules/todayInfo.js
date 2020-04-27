/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const todayInfoRouter = {
  path: '/todayInfo',
  component: Layout,
  redirect: '/todayInfo/limitUp',
  name: '今日涨跌',
  meta: {
    title: '今日涨跌',
    icon: 'nested'
  },
  children: [
    {
      path: 'up',
      component: () => import('@/views/todayInfo/limitUp'),
      name: '涨停',
      meta: { title: '涨停' }
    },
    {
      path: 'down',
      component: () => import('@/views/todayInfo/limitDown'),
      name: '跌停',
      meta: { title: '跌停' }
    }

  ]
}
export default todayInfoRouter
