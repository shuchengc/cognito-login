import App from './App'
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
// import { MemoryRouter } from 'react-router-dom'
import Home from './components/home/Home'

Enzyme.configure({ adapter: new Adapter() })

describe('App Component', () => {
  it('valid path should render home', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find(Home)).toHaveLength(1)
  })
})
