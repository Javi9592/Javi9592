import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, setPassword, setUsername, password, username }) => (
  <form onSubmit={handleLogin}>
    <div>
        username
      <input
        id='username'
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
        password
      <input
        id='password'
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit" id='login-button'>login</button>
  </form>
)

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm