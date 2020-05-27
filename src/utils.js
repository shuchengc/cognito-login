export const getDeepComponent = (wrapper, componentName) => {
  return wrapper.find(componentName)
}

export const getClientName = () => {
  return window.location.hostname && window.location.hostname.split('.')[0]
}

export const getClientDomain = () => {
  return window.location.origin
}

export const getCognitoAuthUrl = providerName => {
  const {
    REACT_APP_USER_POOL_CLIENT_ID,
    REACT_APP_COGNITO_DOMAIN,
    REACT_APP_COGNITO_AUTH_PATH,
    REACT_APP_COGNITO_REDIRECT_URL,
    REACT_APP_COGNITO_SCOPE
  } = process.env

  return `${REACT_APP_COGNITO_DOMAIN}${REACT_APP_COGNITO_AUTH_PATH}?identity_provider=${providerName}&redirect_uri=${REACT_APP_COGNITO_REDIRECT_URL}&response_type=CODE&client_id=${REACT_APP_USER_POOL_CLIENT_ID}&scope=${REACT_APP_COGNITO_SCOPE}`
}

export const ssoClients = [
  'lexusca',
  'mazda',
  'mbvadsuite',
  'toyota',
  'toyotaca',
  'vwadbox'
]
