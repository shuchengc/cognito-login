import SendVerifyCodeForm from './SendVerifyCodeForm'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { getDeepComponent } from '../../utils'
import { BrowserRouter as Router } from 'react-router-dom'
import sinon from 'sinon'
import { act } from 'react-dom/test-utils'

Enzyme.configure({ adapter: new Adapter() })

describe('SendVerifyCodeForm component', () => {
  let wrapper
  let sendVerifyCodeFormComponent
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <SendVerifyCodeForm match={{ params: { email: 'test@myadbox.com' } }} />
      </Router>
    )
    sendVerifyCodeFormComponent = getDeepComponent(
      wrapper,
      'SendVerifyCodeForm'
    )
  })
  describe('Component render', () => {
    it('Should render all component elements without error', () => {
      expect(
        sendVerifyCodeFormComponent.find('.reset-password-header')
      ).toHaveLength(1)
      expect(
        sendVerifyCodeFormComponent.find('.reset-password-header').text()
      ).toEqual('getVerificationCodeText')
      expect(
        sendVerifyCodeFormComponent.find('input[type="email"]')
      ).toHaveLength(1)
      expect(
        sendVerifyCodeFormComponent.find('button.btn-primary')
      ).toHaveLength(1)
    })
  })
  describe('email change', () => {
    beforeEach(() => {
      sendVerifyCodeFormComponent
        .find('input[type="email"]')
        .simulate('change', {
          target: { name: 'email', value: 'test@myadbox.com' }
        })
    })
    it('Should change email correctly', () => {
      expect(
        sendVerifyCodeFormComponent
          .update()
          .find('input[type="email"]')
          .prop('value')
      ).toEqual('test@myadbox.com')
    })
  })
  describe('email change submit', () => {
    let spy
    beforeEach(async () => {
      spy = sinon.spy(
        sendVerifyCodeFormComponent.instance(),
        'handleSendCodeClick'
      )
      sendVerifyCodeFormComponent
        .find('input[type="email"]')
        .at(0)
        .simulate('change', {
          target: { name: 'email', value: 'test@myadbox.com' }
        })
      await act(async () => {
        sendVerifyCodeFormComponent
          .find('button[type="submit"]')
          .simulate('submit')
      })
    })
    afterEach(() => {
      sinon.restore()
    })
    it('Should call handleSendCodeClick successfully', () => {
      setInterval(() => {
        return expect(spy.calledOnce).toEqual(true)
      }, 2000)
    })
  })
})
