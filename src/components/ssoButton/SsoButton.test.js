import SsoButton from './SsoButton'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { BrowserRouter as Router } from 'react-router-dom'
import { getDeepComponent } from '../../utils'

Enzyme.configure({ adapter: new Adapter() })

describe('SsoButton component', () => {
  let wrapper
  let ssoButtonComponent

  beforeEach(() => {
    wrapper = mount(
      <Router>
        <SsoButton location={{ search: {} }} />
      </Router>
    )
    ssoButtonComponent = getDeepComponent(wrapper, 'SsoButton')
  })

  it('Should render elements without error', () => {
    expect(ssoButtonComponent.isEmptyRender()).toBe(true)
  })
})

describe('SsoButton renderMbvadsuiteButton', () => {
  let wrapper
  let ssoButtonComponent

  beforeEach(() => {
    global.window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://mbvadsuite.myadboxapp.com',
        hostname: 'mbvadsuite.myadboxapp.com'
      },
      writable: true
    })

    wrapper = mount(
      <Router>
        <SsoButton />
      </Router>
    )
    ssoButtonComponent = getDeepComponent(wrapper, 'SsoButton')
  })

  it('Should call checkUserSession', () => {
    expect(ssoButtonComponent.isEmptyRender()).toBe(false)
    expect(ssoButtonComponent.find('Header').text()).toEqual('ssoLoginText')
    expect(ssoButtonComponent.find('Button').text()).toEqual(
      'ssoLoginButtonText'
    )
  })
})
