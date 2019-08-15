import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  text-align: center;
  color: white;
  padding: 30px 10px;
`;

export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      &copy; 2019. HIV Department: Ministry of Health
    </FooterContainer>
  )
}