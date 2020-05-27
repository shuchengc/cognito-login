import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import { Button } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      changingPassword: false,
      passwordChanged: false,
      errMsg: null
    }
  }

  handleChangePasswordClick = async values => {
    const { code, password } = values
    const {
      location: { state },
      history
    } = this.props

    this.setState({ changingPassword: true })

    try {
      await Auth.forgotPasswordSubmit(state.email, code, password)
      this.setState({ changingPassword: false, passwordChanged: true })
      setTimeout(() => {
        history.push('/cognito')
      }, 2000)
    } catch (e) {
      this.setState({
        changingPassword: false,
        errMsg: e.message.replace(/username/i, 'email')
      })
    }
  }

  render() {
    const { changingPassword, passwordChanged, errMsg } = this.state
    const { history, t } = this.props

    return passwordChanged ? (
      <p>{t('passwordUpdatedText')}</p>
    ) : (
      <Formik
        initialValues={{ code: '', password: '', passwordConfirmation: '' }}
        validationSchema={Yup.object({
          code: Yup.string().required(t('requiredText')),
          password: Yup.string()
            .required(t('requiredText'))
            .min(8, t('passwordShortText'))
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_+=])(?=.{8,})/,
              t('passwordInvalidText')
            ),
          passwordConfirmation: Yup.string()
            .required(t('requiredText'))
            .oneOf([Yup.ref('password')], t('passwordNotMatchText'))
        })}
        onSubmit={this.handleChangePasswordClick}
      >
        {props => (
          <Form className='reset-password-form'>
            <div>
              <p
                className='back-login'
                onClick={() => history.push('/cognito')}
              >
                &lt; {t('backToLoginText')}
              </p>
            </div>
            <div>
              <h2 className='reset-password-header'>
                {t('getVerificationCodeText')}
              </h2>
            </div>
            <div className='field'>
              <Field name='code' placeholder={t('verificationCodeLabel')} />
              <ErrorMessage
                name='code'
                render={msg => <div className='error-msg'>{msg}</div>}
              />
            </div>
            <div className='field'>
              <Field
                type='password'
                name='password'
                placeholder={t('passwordLabel')}
              />
              <ErrorMessage
                name='password'
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
            {errMsg && <div className='submitted-error-msg'>{errMsg}</div>}
            <div className='change-password-button'>
              <Button
                className='btn-primary'
                type='submit'
                loading={changingPassword}
              >
                {t('resetText')}
              </Button>
            </div>
            <p className='form-description'>{t('formFooterText')}</p>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withTranslation()(ResetPasswordForm)
