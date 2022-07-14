import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC<{}> = () => {
  const navigate = useNavigate()
  const goHome = () => {
    navigate('/')
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle={'找不到页面了'}
      extra={
        <Button type="primary" onClick={goHome}>
          {'返回首页'}
        </Button>
      }
    ></Result>
  )
}

export default NotFound
