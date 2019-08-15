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
      &copy; 2019. HIV department: Ministry of Health
    </FooterContainer>
  )
}