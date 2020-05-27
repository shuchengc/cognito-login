import React, { Component, Fragment } from 'react'
import { Button, Dimmer, Loader } from 'semantic-ui-react'
import { Auth } from 'aws-amplify'
import axios from 'axios'
import { withTranslation } from 'react-i18next'
import * as Sentry from '@sentry/browser'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import SsoButton from '../../components/ssoButton/SsoButton'

class SigninForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      newPassword: '',
      authChecking: true,
      errMsg: null,
      tempUser: null
    }
  }

  componentDidMount () {
    const values = queryString.parse(this.props.location.search)
    if (values && values.logout) {
      Auth.signOut()
        .then(() => this.setState({ authChecking: false }))
        .catch(err => this.reportError(err, false))
    } else {
      this.checkUserSession()
    }
  }

  handleNewPasswordSubmit = async values => {
    const { tempUser } = this.state
    const { newPassword } = values
    this.setState({ loading: true, errMsg: null })

    try {
      await Auth.completeNewPassword(tempUser, newPassword)
      this.checkUserSession()
    } catch (err) {
      this.reportError(err, true)
    }
  }

  handleSubmit = async values => {
    const { email, password } = values
    const { t } = this.props
    this.setState({ loading: true, errMsg: null })
    try {
      const user = await Auth.signIn(email, password)
      if (user) {
        if (user.challengeName) {
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            console.log(
              t('needFurtherStepText', { challengeName: user.challengeName })
            )
            this.setState({ loading: false, tempUser: user })
          } else {
            this.reportError(
              t('needFurtherStepText', { challengeName: user.challengeName }),
              true
            )
          }
        } else this.checkUserSession()
      }
    } catch (err) {
      this.reportError(err, true)
    }
  }

  checkUserSession = () => {
    Auth.currentSession()
      .then(cognitoSession => {
        localStorage.setItem('cognito-auth', JSON.stringify(cognitoSession))
        this.setState({ loading: false, authChecking: true })
        axios
          .post('/user_sessions', {
            cognitoLoginRequest: true,
            ...cognitoSession
          })
          .then(res => {
            if (res) {
              window.location.replace('/dashboard')
            }
          })
          .catch(err => this.reportError(err))
      })
      .catch(err => this.reportError(err))
  }

  reportError = (err, showErrMsg = false) => {
    if (err) {
      const message = err.message || err
      console.log(message)
      Sentry.captureMessage(message)
      this.setState({
        loading: false,
        authChecking: false,
        errMsg: showErrMsg ? message.replace(/username/i, 'email') : null
      })
    } else {
      this.setState({ authChecking: false })
    }
  }

  renderSignInForm = () => {
    const { loading, errMsg } = this.state
    const { t } = this.props
    return (
      <Fragment>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email(t('invalidEmailText'))

              //               .required(t('requiredEmailText')),
              //             password: Yup.string()
              //               .required(t('requiredPasswordText'))
              //               .min(8, t('passwordShortText'))
              //               .matches(
              //                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-"!@#%&/\\,><':;|_~`])/,
              //                 t('passwordInvalidText')
              //               )
              .required(t('requiredEmailText')),
            password: Yup.string().required(t('requiredPasswordText'))

          })}
          onSubmit={this.handleSubmit}
        >
          {props => (
            <Form className='sign-in-form'>
              {/* <header className="header">
                <h2 className='reset-password-header'>
                  Login to MyAdbox
                </h2>
              </header> */}
              {/* <header>
                
              </header> */}
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <Field
                  type='email'
                  name='email'
                  placeholder={t('emailLabel')}
                />
                <ErrorMessage
                  name='email'
                  render={msg => <div className='error-msg'>{msg}</div>}
                />
              </div>

              <div className='form-field'>
                <label htmlFor="password">Password</label>
                <Field
                  className='field'
                  type='password'
                  name='password'
                  placeholder={t('passwordLabel')}
                />
                <div className="helper-wrapper">
                  <ErrorMessage
                    name='password'
                    render={msg => <div className='error-msg'>{msg}</div>}
                  />
                  {errMsg && <div className='submitted-error-msg'>{errMsg}</div>}
                  <Link className='reset-password btn-link' to='/cognito/send-verify-code'>
                    {t('resetPasswordText')}
                  </Link>
                </div>
              </div>
              {errMsg && <div className='submitted-error-msg'>{errMsg}</div>}
              <div className='action'>
                <Button className='btn btn-primary' type='submit' loading={loading}>
                  {t('loginText')}
                </Button>
              </div>

              {/* THIS IS A VARIABLE */}
              {/* REGISTRATION AREA */}

              {/* <section className="helper-links"> */}
              {/* <div>
                  <Link className='reset-password btn-link' to='/cognito/send-verify-code'>
                    {t('resetPasswordText')}
                  </Link>
                </div> */}
              {/* <div> */}
              {/* <Link className='reset-password btn-link' to="/cognito/send-verify-code">
                    {t('registerText')}
                  </Link> */}
              {/* </div> */}
              {/* </section> */}
              {/* <div className="back-login">
                
              </div> */}

              {/* IF STATEMENT - CLIENT VARIABLE */}
              {/* <section className="client-login section"> */}
              {/* <h3>Login with your TMCA Network Account</h3> */}
              {/* CHANGE CLASS NAME TO MATCH CLIENT */}
              {/* <Button className="btn btn--toyota" type="submit" loading={loading}>
                  TMCA Network login
                </Button> */}
              {/* </section> */}
              {/* IF STATEMENT - CLIENT VARIABLE */}
              {/* <section className="client-support section">
                <h3>Support Details</h3>
                <div>
                  <a href="tel:0381035014" className="btn-link"><i className="icon-phone"></i> 03 8103 5014</a>
                </div>
                <div>
                  <a href="mailto:helpdesk@toyota-adbuilder.com" className="btn-link"><i className="icon-email"></i> helpdesk@toyota-adbuilder.com</a>
                </div>
              </section> */}
              {/* <footer className="form-footer">
                <Link to="/privacy-policy">
                  Privacy Policy
                </Link>
                <Link to="/terms-conditions">
                  Terms and conditions
                </Link>
                <Link to="/gdpr">
                  GDPR Compliance
                </Link>
              </footer> */}
            </Form>
          )}
        </Formik>
        <SsoButton />
        {/* <p className='form-description tagline'>{t('formFooterText')}</p> */}
      </Fragment>
    )
  }

  renderSetNewPasswordForm = () => {
    const { loading, errMsg } = this.state
    const { t } = this.props

    return (
      <Formik
        initialValues={{ newPassword: '', passwordConfirmation: '' }}
        validationSchema={Yup.object({
          newPassword: Yup.string()
            .required(t('requiredText'))
            .min(8, t('passwordShortText'))
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_+=])(?=.{8,})/,
              t('passwordInvalidText')
            ),
          passwordConfirmation: Yup.string()
            .required(t('requiredText'))
            .oneOf([Yup.ref('newPassword')], t('passwordNotMatchText'))
        })}
        onSubmit={this.handleNewPasswordSubmit}
      >
        {props => (
          <Form className='set-new-password-form'>
            <div>
              <p
                className='back-login'
                onClick={() => window.location.replace('/cognito')}
              >
                &lt; {t('backToLoginText')}
              </p>
            </div>
            <div>
              <h2 className='change-password-header'>
                {t('setNewPasswordText')}
              </h2>
            </div>
            <div className='field'>
              <Field
                type='password'
                name='newPassword'
                placeholder={t('newPasswordLabel')}
              />
              <ErrorMessage
                name='newPassword'
                render={msg => <div className='error-msg'>{msg}</div>}
              />
            </div>
            <div className='field'>
              <Field
                type='password'
                name='passwordConfirmation'
                placeholder={t('passwordConfirmationText')}
              />
              <ErrorMessage
                name='passwordConfirmation'
                render={msg => <div className='error-msg'>{msg}</div>}
              />
            </div>
            <div className='change-password-button'>
              <Button className='btn-primary' type='submit' loading={loading}>
                {t('setText')}
              </Button>
            </div>
            {errMsg && <div className='submitted-error-msg'>{errMsg}</div>}
            {/* <p className='form-description'>{t('formFooterText')}</p> */}
          </Form>
        )}
      </Formik>
    )
  }

  render () {
    const { authChecking, tempUser } = this.state
    const { t } = this.props

    return authChecking ? (
      <div className='auth-loader'>
        <Dimmer active>
          <Loader content={t('authCheckingText')} />
        </Dimmer>
      </div>
    ) : tempUser ? (
      this.renderSetNewPasswordForm()
    ) : (
          this.renderSignInForm()
        )
  }
}

export default withTranslation()(SigninForm)
