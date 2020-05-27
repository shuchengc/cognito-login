import React, { Component } from 'react'
import { Header, Button } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'
import { getClientName, getCognitoAuthUrl, ssoClients } from '../../utils'

import './SsoButton.scss'

class SsoButton extends Component {
  renderSsoButton = () => {
    const clientName = getClientName()

    if (ssoClients.includes(clientName))
      return this.renderClientButton(clientName)
    else return null
  }

  renderClientButton = clientName => {
    const { t } = this.props
    const ssoAccountName = t(`${clientName}LoginButtonText`)
    return (
      <div className='client-sso'>
        <Header as='h5'>{t('ssoLoginText', { ssoAccountName })}</Header>

        {/* TODO: WILL CHANGE THE SSO BUTTON LINK TO getCognitoAuthUrl(clientName) whenever a client IdP is configured with Cognito */}
        <Button
          className='btn-primary sso-button'
          onClick={() => (window.location.href = '/sso_login')}
        >
          {t('ssoLoginButtonText', { ssoAccountName })}
        </Button>
      </div>
    )
  }

  render() {
    return this.renderSsoButton()
  }
}

export default withTranslation(['sso'])(SsoButton)
