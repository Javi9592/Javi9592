import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/loginReducer'
import {
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
} from 'react-bootstrap'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(setUser(username, password))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel>Username:</FormLabel>
        <FormControl
          id='username'
          value={username}
          className="form-control"
          onChange={({ target }) => setUsername(target.value)}
        />
        <FormLabel>Password:</FormLabel>
        <FormControl
          id='password'
          type='password'
          className="form-control"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button variant='success' className='custom-button' id='login-button' type='submit'>
          Login
        </Button>
      </FormGroup>
    </Form>
  )
}

export default LoginForm
