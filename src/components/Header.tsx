import React from 'react';
import logo from './../ministryLogo.png'
import styled from 'styled-components';

const LogoContainer = styled.div`
  padding: .6rem;
`;

export const Header: React.FC = () => {
  return (
    <div>
      <LogoContainer>
        <img src={logo} className="logo" alt="malawi government logo" />
      </LogoContainer>
    </div>
  )
}