import { FC } from 'react'
import { userStore } from '@/store/user'
import './index.less'

const dashboard: FC = () => {
  const { username } = userStore
  return (
    <div className="dashboard">
      <span>首页</span>
      <div>{`mobx 状态管理：${username} `}</div>
    </div>
  )
}

export default dashboard
