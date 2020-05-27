import SignInForm from './SigninForm'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'
import { BrowserRouter as Router } from 'react-router-dom'
import { getDeepComponent } from '../../utils'
import { act } from 'react-dom/test-utils'

Enzyme.configure({ adapter: new Adapter() })

describe('SignInForm component', () => {
  let wrapper
  let signInFormComponent

  beforeEach(() => {
    wrapper = mount(
      <Router>
        <SignInForm location={{ search: {} }} />
      </Router>
    )
    signInFormComponent = getDeepComponent(wrapper, 'SigninForm')
  })

  it('Should render elements without error', () => {
    expect(signInFormComponent.find('.auth-loader')).toHaveLength(1)
    signInFormComponent.setState({ authChecking: false }, () => {
      signInFormComponent = getDeepComponent(wrapper, 'SigninForm')
      expect(signInFormComponent.find('Form')).toHaveLength(1)
      expect(signInFormComponent.find('input')).toHaveLength(2)
      expect(signInFormComponent.find('a.reset-password')).toHaveLength(1)
      expect(signInFormComponent.find('a.reset-password').text()).toEqual(
        'resetPasswordText'
      )
      expect(signInFormComponent.find('Button')).toHaveLength(1)
      expect(signInFormComponent.find('Button').prop('loading')).toEqual(false)
      signInFormComponent.setState({ loading: true }, () => {
        expect(wrapper.find('Button').prop('loading')).toEqual(true)
      })
    })
  })
})

describe('SignInForm componentDidMount', () => {
  let wrapper
  let signInFormComponent
  let spy
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <SignInForm location={{ search: {} }} />
      </Router>
    )
    signInFormComponent = getDeepComponent(wrapper, 'SigninForm')
    spy = sinon.spy(signInFormComponent.instance(), 'checkUserSession')
  })
  it('Should call checkUserSession', () => {
    signInFormComponent.instance().componentDidMount()
    expect(spy.calledOnce).toEqual(true)
  })
})

describe('SignIn form input change', () => {
  let wrapper
  let signInFormComponent
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <SignInForm location={{ search: {} }} />
      </Router>
    )
    getDeepComponent(wrapper, 'SigninForm').setState(
      { authChecking: false },
      () => {
        signInFormComponent = getDeepComponent(wrapper, 'SigninForm')
      }
    )
  })
  it('Should capture username change correctly', () => {
    expect(
      signInFormComponent
        .find('input')
        .at(0)
        .prop('value')
    ).toEqual('')
    signInFormComponent
      .find('input')
      .at(0)
      .simulate('change', {
        persist: () => {},
        target: { name: 'email', value: 'test@myadbox.com.au' }
      })
    expect(
      signInFormComponent
        .update()
        .find('input')
        .at(0)
        .prop('value')
    ).toEqual('test@myadbox.com.au')
  })
  it('Should capture password change correctly', () => {
    expect(
      signInFormComponent
        .find('input')
        .at(1)
        .prop('value')
    ).toEqual('')
    signInFormComponent
      .find('input')
      .at(1)
      .simulate('change', {
        persist: () => {},
        target: { name: 'password', value: 'Password123*' }
      })
    expect(
      signInFormComponent
        .update()
        .find('input')
        .at(1)
        .prop('value')
    ).toEqual('Password123*')
  })
})

describe('user sign in', () => {
  let wrapper
  let signInFormComponent
  let spy
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <SignInForm location={{ search: {} }} />
      </Router>
    )
    getDeepComponent(wrapper, 'SigninForm').setState(
      { authChecking: false },
      async () => {
        signInFormComponent = getDeepComponent(wrapper, 'SigninForm')
        spy = sinon.spy(signInFormComponent.instance(), 'handleSubmit')
        wrapper
          .find('input')
          .at(0)
          .simulate('change', {
            persist: () => {},
            target: { name: 'email', value: 'test@myadbox.com.au' }
          })
        wrapper
          .find('input')
          .at(1)
          .simulate('change', {
            persist: () => {},
            target: { name: 'password', value: 'Password123*' }
          })
      }
    )
  })
  afterEach(() => {
    sinon.restore()
  })
  it('Should call handleSumit when submit button clicked', async () => {
    await act(async () =>
      signInFormComponent.find('Formik').simulate('submit', {
        preventDefault: () => {}
      })
    )
    setInterval(() => {
      return expect(spy.calledOnce).toEqual(true)
    }, 2000)
  })
})
