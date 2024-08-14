import React from 'react';
import { Link, useNavigate } from 'react-router-dom'


const Nav = () => {
  const auth = localStorage.getItem('user');
  const navigate = useNavigate()
  const logout = () => {
    localStorage.clear();
    navigate('/signup')
  }
  return (
    <div>
      <img alt='logo' className='logo'
        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRiqxOlCtX1w_zGcftNtayHpUANJTJ_7v4Q_f6aP4-Ojjy5v7i-ZlepQi5NiLvW_T0JV8&usqp=CAU' />
      {auth ? <ul className='nav-ul'>
        <li><Link to='/'>Products</Link></li>
        <li><Link to='/add'>Add Product</Link></li>
        <li><Link to='/update'>Update Product</Link></li>
        <li><Link to='/profile'>Profile</Link></li>
        <li><Link onClick={logout} to='/signup'>Logout ({JSON.parse(auth).name})</Link></li>
      </ul>
        : <ul className='nav-ul nav-right'>
          <li><Link to='/signup'>Sign Up</Link></li>
          <li><Link to='/login'>Login</Link></li>
        </ul>
      }

    </div>
  )
}
export default Nav