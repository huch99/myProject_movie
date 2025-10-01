import type React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

const SpinnerElement = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #e51937; // 영화 사이트 테마 색상
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium' }) => {
  const getSize = () => {
    switch (size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  };

  return (
    <SpinnerContainer>
      <SpinnerElement style={{ width: getSize(), height: getSize() }} />
    </SpinnerContainer>
  );
};

export default Spinner;