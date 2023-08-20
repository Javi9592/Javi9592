import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const info = useSelector(state => state.notification)

  if (!info.value) {
    return
  }
  //const style = {color: info.info === 'error' ? 'red' : 'green',}

  return <Alert variant={info.info === 'error' ? 'danger' : 'success'}>{info.value}</Alert>
}

export default Notification
