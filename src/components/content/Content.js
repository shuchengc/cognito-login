import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SigninForm from '../signInForm/SigninForm'
import SendVerifyCodeForm from '../sendVerifyCodeForm/SendVerifyCodeForm'
import ResetPasswordForm from '../resetPasswordForm/ResetPasswordForm'
import ChangePasswordForm from '../changePasswordForm/ChangePasswordForm'
import './Content.scss'

class Content extends Component {
  render() {
    return (
      <div className='content'>
        <Router>
          <Route exact path='/cognito' component={SigninForm} />
          <Route
            path='/cognito/send-verify-code/:email?'
            component={SendVerifyCodeForm}
          />
          <Route
            exact
            path='/cognito/reset-password'
            component={ResetPasswordForm}
          />
          <Route
            exact
            path='/cognito/change-password'
            component={ChangePasswordForm}
          />
        </Router>
      </div>
    )
  }
}

export default Content
