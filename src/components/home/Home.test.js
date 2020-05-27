import Home from './Home';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Home component', () => {
  it('Should render without errors', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('.logo')).toHaveLength(1);
    expect(wrapper.find('Content')).toHaveLength(1);
    expect(wrapper.find('.cube-grid')).toHaveLength(1);
  });
});
