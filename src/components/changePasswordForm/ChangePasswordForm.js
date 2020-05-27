import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import { Button, Form, Message } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'

class ChangePasswordForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldPassword: '',
      newPassword: '',
      changingPassword: false,
      passwordChanged: false,
      authenticated: false,
      errMsg: null,
      user: null
    }
  }

  componentDidMount = () => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState({ user: user, authenticated: true })
      })
      .catch(error => this.setState({ errMsg: error }))
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleChangePasswordClick = async event => {
    event.preventDefault()

    const { oldPassword, newPassword, user } = this.state
    const { history } = this.props

    this.setState({ changingPassword: true })

    try {
      await Auth.changePassword(user, oldPassword, newPassword)
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
    const {
      changingPassword,
      passwordChanged,
      errMsg,
      oldPassword,
      newPassword,
      authenticated
    } = this.state
    const { history, t } = this.props

    return authenticated ? (
      passwordChanged ? (
        <p>{t('passwordUpdatedText')}</p>
      ) : (
        <Form
          key='changing-password'
          className='change-password-form'
          onSubmit={this.handleChangePasswordClick}
          error={!!errMsg}
        >
          <div>
            <p className='back-login' onClick={() => history.push('/cognito')}>
              &lt; {t('backToLoginText')}
            </p>
          </div>
          <div>
            <h2 className='change-password-header'>
              {t('changePasswordText')}
            </h2>
          </div>

          <Form.Input
            id='oldPassword'
            name='oldPassword'
            type='password'
            value={oldPassword}
            placeholder={t('oldPasswordLabel')}
            onChange={this.handleChange}
          />
          <Form.Input
            id='newPassword'
            name='newPassword'
            type='password'
            value={newPassword}
            placeholder={t('newPasswordLabel')}
            onChange={this.handleChange}
          />
          {!!errMsg && <Message error content={errMsg} />}

          <div className='change-password-button'>
            <Button
              className='btn-primary'
              type='submit'
              loading={changingPassword}
            >
              {t('updatePasswordText')}
            </Button>
          </div>
          <p className='form-description'>{t('formFooterText')}</p>
        </Form>
      )
    ) : (
      <p>{t('requireLoginText')}</p>
    )
  }
}

export default withTranslation()(ChangePasswordForm)
