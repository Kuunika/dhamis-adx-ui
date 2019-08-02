import React from 'react';
import logo from './../ministryLogo.png'

const Header: React.FC = () => {
  return (
    <div>
      <img src={logo} className="logo" alt="malawi government logo" />
    </div>
  )
}

export default Header;