import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from 'react-router-dom'
import SigninForm from '../signInForm/SigninForm'
import ResetPasswordForm from '../resetPasswordForm/ResetPasswordForm'
import SendVerifyCodeForm from '../sendVerifyCodeForm/SendVerifyCodeForm'

Enzyme.configure({ adapter: new Adapter() })

describe('Content component', () => {
  describe('cognito root route', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/cognito']}>
          <SigninForm location={{ search: {} }} />
        </MemoryRouter>
      )
    })
    it('Should render SignInForm component', () => {
      expect(wrapper.find('SigninForm')).toHaveLength(1)
    })
  })
  describe('cognito change-password route', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/cognito/change-password']}>
          <ResetPasswordForm />
        </MemoryRouter>
      )
    })
    it('Should render ResetPasswordForm component', () => {
      expect(wrapper.find('ResetPasswordForm')).toHaveLength(1)
    })
  })
  describe('cognito send-verify-code route', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/cognito/send-verify-code/:email?']}>
          <SendVerifyCodeForm
            match={{ params: { email: 'test@myadbox.com' } }}
          />
        </MemoryRouter>
      )
    })
    it('Should render SendVerifyCodeForm component', () => {
      expect(wrapper.find('SendVerifyCodeForm')).toHaveLength(1)
    })
  })
})
