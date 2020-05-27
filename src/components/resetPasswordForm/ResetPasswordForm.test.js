import ResetPasswordForm from './ResetPasswordForm'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { getDeepComponent } from '../../utils'
import { BrowserRouter as Router } from 'react-router-dom'
import sinon from 'sinon'
import { act } from 'react-dom/test-utils'

Enzyme.configure({ adapter: new Adapter() })

describe('ResetPasswordForm component', () => {
  let wrapper
  let resetPasswordFormComponent
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <ResetPasswordForm />
      </Router>
    )
    resetPasswordFormComponent = getDeepComponent(wrapper, 'ResetPasswordForm')
  })

  describe('component elments render', () => {
    it('Should render elements without error', () => {
      expect(resetPasswordFormComponent.find('.back-login')).toHaveLength(1)
      expect(resetPasswordFormComponent.find('.back-login').text()).toEqual(
        '< backToLoginText'
      )
      expect(
        resetPasswordFormComponent.find('.reset-password-header')
      ).toHaveLength(1)
      expect(
        resetPasswordFormComponent.find('.reset-password-header').text()
      ).toEqual('getVerificationCodeText')
      expect(
        resetPasswordFormComponent.find('input[name="code"]')
      ).toHaveLength(1)
      expect(
        resetPasswordFormComponent.find('input[name="password"]')
      ).toHaveLength(1)
      expect(
        resetPasswordFormComponent.find('input[name="passwordConfirmation"]')
      ).toHaveLength(1)
      expect(
        resetPasswordFormComponent.find('button.btn-primary')
      ).toHaveLength(1)
    })
  })
  describe('reset password form input change', () => {
    it('Should verify code input change correctly', async () => {
      expect(
        resetPasswordFormComponent.find('input[name="code"]').prop('value')
      ).toEqual('')
      await act(async () => {
        resetPasswordFormComponent
          .find('input[name="code"]')
          .simulate('change', {
            persist: () => {},
            target: { name: 'code', value: 'code' }
          })
      })
      expect(
        resetPasswordFormComponent
          .update()
          .find('input[name="code"]')
          .prop('value')
      ).toEqual('code')
    })
    it('Should password input change correctly', async () => {
      expect(
        resetPasswordFormComponent.find('input[name="password"]').prop('value')
      ).toEqual('')
      await act(async () => {
        resetPasswordFormComponent
          .find('input[name="password"]')
          .simulate('change', {
            persist: () => {},
            target: { name: 'password', value: 'Password123*' }
          })
      })
      expect(
        resetPasswordFormComponent
          .update()
          .find('input[name="password"]')
          .prop('value')
      ).toEqual('Password123*')
    })
    it('Should password confirmation input change correctly', async () => {
      expect(
        resetPasswordFormComponent
          .find('input[name="passwordConfirmation"]')
          .prop('value')
      ).toEqual('')
      await act(async () => {
        resetPasswordFormComponent
          .find('input[name="passwordConfirmation"]')
          .simulate('change', {
            persist: () => {},
            target: { name: 'passwordConfirmation', value: 'Password123*' }
          })
      })
      expect(
        resetPasswordFormComponent
          .update()
          .find('input[name="passwordConfirmation"]')
          .prop('value')
      ).toEqual('Password123*')
    })
  })
  describe('change password submit', () => {
    let spy
    beforeEach(async () => {
      spy = sinon.spy(
        resetPasswordFormComponent.instance(),
        'handleChangePasswordClick'
      )
      await act(async () => {
        resetPasswordFormComponent
          .find('input[name="code"]')
          .simulate('change', {
            target: { name: 'code', value: 'code' }
          })
      })
      await act(async () => {
        resetPasswordFormComponent
          .find('input[name="password"]')
          .simulate('change', {
            target: { name: 'password', value: 'Password123*' }
          })
      })
      await act(async () => {
        resetPasswordFormComponent
          .find('input[name="passwordConfirmation"]')
          .simulate('change', {
            target: { name: 'passwordConfirmation', value: 'Password123*' }
          })
      })
    })
    it('Should call handleChangePasswordClick successfully', async () => {
      await act(async () => {
        resetPasswordFormComponent.find('Formik').simulate('submit')
      })
      setInterval(() => {
        return expect(spy.calledOnce).toEqual(true)
      }, 2000)
    })
  })
})
