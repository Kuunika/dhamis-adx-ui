import React from 'react';
import { Box } from '@material-ui/core'
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: #ff0000b8;
  color: white;
  padding: 1rem;
  font-weight: 600;
  text-align: center;
`;

type ErrorProps = {
  message: string
}

export const MigrationError: React.FC<ErrorProps> = (props) => {
  return (
    <ErrorContainer>
      <Box>
        {props.message}
      </Box>
    </ErrorContainer>
  );
}