import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import { Button } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

class SendVerifyCodeForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sendingCode: false,
      codeSent: false,
      errMsg: null
    }
  }

  componentDidMount = () => {
    this.checkEmailParams()
  }

  handleSendCodeClick = async values => {
    const { email } = values
    const { history } = this.props
    this.setState({ sendingCode: true })
    try {
      await Auth.forgotPassword(email)
      this.setState({ sendingCode: false, codeSent: true })
      setTimeout(() => {
        history.push({
          pathname: '/cognito/reset-password',
          state: { email }
        })
      }, 2000)
    } catch (e) {
      this.setState({
        sendingCode: false,
        errMsg: e.message.replace(/username/i, 'email')
      })
    }
  }

  checkEmailParams = () => {
    const {
      match: {
        params: { email }
      }
    } = this.props
    if (email) {
      this.handleSendCodeClick({ email })
    }
  }

  render () {
    const { sendingCode, errMsg, codeSent } = this.state
    const { history, t } = this.props

    return codeSent ? (
      <h4>{t('codeSentText')}</h4>
    ) : (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email(t('invalidEmailText'))
              .required(t('requiredEmailText'))
          })}
          onSubmit={this.handleSendCodeClick}
        >
          {props => (
            <Form className='reset-password-form'>

              <header className="header">
                <h2 className='reset-password-header'>
                  {t('getVerificationCodeText')}
                </h2>
              </header>
              <div className='form-field'>
                <label htmlFor="email">Email</label>
                <Field className="field" type='email' name='email' placeholder={t('emailLabel')} />

                <ErrorMessage
                  name='email'
                  render={msg => <div className='error-msg'>{msg}</div>}
                />

                <button
                  className="btn-link"
                  onClick={() => history.push('/cognito')}
                >
                  {t('backToLoginText')}
                </button>
              </div>
              {errMsg && <div className='submitted-error-msg'>{errMsg}</div>}
              <div className='action'>
                {/* <div className='reset-password-button'> */}
                <Button
                  className='btn btn-primary'
                  type='submit'
                  loading={sendingCode}
                >
                  {t('sendVerificationCodeText')}
                </Button>
                {/* </div> */}
              </div>

              {/* <p className='form-description'>{t('formFooterText')}</p> */}
            </Form>
          )}
        </Formik>
      )
  }
}

export default withTranslation()(SendVerifyCodeForm)
