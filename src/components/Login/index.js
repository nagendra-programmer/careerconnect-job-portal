import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
    isLoading: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  useDemoCredentials = () => {
    this.setState({
      username: 'guru',
      password: '123456789',
      showError: false,
      errorMsg: '',
    })
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    this.setState({isLoading: true})

    const {username, password} = this.state

    try {
      const response = await fetch(
        "https://careerconnect-backend-gx9j.onrender.com/auth/login",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({username, password}),
        }
      )

      const data = await response.json()

      if (response.ok) {
        this.onSubmitSuccess(data.jwt_token)
      } else {
        this.onSubmitFailure(data.err_msg)
        this.setState({isLoading: false})
      }
    } catch (error) {
      this.setState({
        showError: true,
        errorMsg: "Server is waking up... please try again",
        isLoading: false,
      })
    }
  }

  onRegister = () => {
    const {history} = this.props
    history.push('/register')
  }

  render() {
    const {username, password, showError, errorMsg, isLoading} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page">

        {/* 🔹 DEMO CARD */}
        <div className="demo-card">
          <h3>Demo Credentials</h3>
          <p><strong>Username:</strong> guru</p>
          <p><strong>Password:</strong> 123456789</p>
          <button
            type="button"
            className="demo-btn"
            onClick={this.useDemoCredentials}
          >
            Use Demo Login
          </button>
        </div>

        {/* 🔹 LOGIN CARD */}
        <div className="login-container">
          <form className="login-form" onSubmit={this.onSubmitForm}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="login-logo"
            />

            <label className="label">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={this.onChangeUsername}
              className="input"
            />

            <label className="label">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={this.onChangePassword}
              className="input"
            />

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            <button
              type="button"
              className="login-button"
              onClick={this.onRegister}
              disabled={isLoading}
            >
              Register
            </button>

            {showError && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>

      </div>
    )
  }
}

export default Login