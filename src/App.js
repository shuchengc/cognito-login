import React from 'react'
import Home from './components/home/Home'
// import 'semantic-ui-css/semantic.min.css'
import * as Sentry from '@sentry/browser'
import Amplify from 'aws-amplify'
import { getClientDomain } from './utils'

const { REACT_APP_STAGE } = process.env || 'staging'
if (REACT_APP_STAGE !== 'development') {
  Sentry.init({
    dsn: 'https://5c431309aaec453c81c1d64963d1d77f@sentry.io/1864511',
    environment: REACT_APP_STAGE
  })
}

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    clientMetadata: { domain: getClientDomain() },
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN.replace('https://', ''),
      scope: [process.env.REACT_APP_COGNITO_SCOPE],
      redirectSignIn: process.env.REACT_APP_COGNITO_REDIRECT_URL,
      responseType: 'code'
    }
  }
})

const App = () => <Home />

export default App
