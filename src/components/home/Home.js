import React from 'react'
import Logo from '../../assets/logo.png'
import CubeGrid from '../../assets/cube-grid.svg'
import Content from '../content/Content'
import './Home.css'

const Home = () => (

  <article className="app-wrapper">
    <div className='branding-myadbox'>
      <img className='logo' src={Logo} alt='MyAdbox logo' />
    </div>
    <section className="pg-wrap">
      <Content />
    </section>
    <div className='cube-grid'>
      <img src={CubeGrid} alt='cube grid' />
    </div>
  </article>
)

export default Home
