import requestList from '@/utils/request'

const request = requestList[1]

export function getKlineByCode() {
  return request({
    url: 'qt/stock/fflow/daykline/get?lmt=0&klt=101&secid=1.600855&fields1=f1,f2,f3,f7&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64,f65&ut=b2884a393a59ad64002292a3e90d46a5&cb=jQuery183031507045660094657_1585899910834&_=1585899911118', // 假地址 自行替换
    method: 'post'
  })
}

