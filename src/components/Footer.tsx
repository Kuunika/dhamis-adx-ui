import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  text-align: center;
  color: white;
  padding: 30px 10px;
`;
const FooterLink = styled.a`
  color: white !important;
  text-decoration: none;
  font-weight: 600;
`;

export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <span><FooterLink href="#">About Project</FooterLink></span>
      &nbsp; | &nbsp;
      <span><FooterLink href="#">About Project</FooterLink></span>
    </FooterContainer>
  )
}