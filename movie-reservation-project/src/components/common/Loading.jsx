import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * 재사용 가능한 로딩 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.size - 로딩 인디케이터 크기 (small, medium, large)
 * @param {string} props.type - 로딩 인디케이터 유형 (spinner, dots, pulse)
 * @param {string} props.text - 로딩 텍스트
 * @param {boolean} props.fullScreen - 전체 화면 오버레이 여부
 */
const Loading = ({
    size = 'medium',
    type = 'spinner',
    text = '로딩 중...',
    fullScreen = false,
}) => {
    // 로딩 인디케이터 렌더링 함수
    const renderLoadingIndicator = () => {
        switch (type) {
            case 'dots':
                return <DotsIndicator size={size} />;
            case 'pulse':
                return <PulseIndicator size={size} />;
            case 'spinner':
            default:
                return <SpinnerIndicator size={size} />;
        }
    };

    // 전체 화면 모드일 경우
    if (fullScreen) {
        return (
            <FullScreenContainer>
                <LoadingContainer>
                    {renderLoadingIndicator()}
                    {text && <LoadingText>{text}</LoadingText>}
                </LoadingContainer>
            </FullScreenContainer>
        );
    }

    // 일반 모드
    return (
        <LoadingContainer>
            {renderLoadingIndicator()}
            {text && <LoadingText>{text}</LoadingText>}
        </LoadingContainer>
    );
};

// 크기 설정
const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px',
};

// 애니메이션 정의
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(0.5); opacity: 0.5; }
  50% { transform: scale(1); opacity: 1; }
`;

const dots = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

// 스타일 컴포넌트
const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-index-modal, 1000);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md, 16px);
`;

const LoadingText = styled.p`
  margin-top: var(--spacing-md, 16px);
  color: var(--color-text-primary);
  font-size: var(--font-size-md, 1rem);
`;

// 스피너 인디케이터
const SpinnerIndicator = styled.div`
  width: ${props => sizeMap[props.size] || sizeMap.medium};
  height: ${props => sizeMap[props.size] || sizeMap.medium};
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// 펄스 인디케이터
const PulseIndicator = styled.div`
  width: ${props => sizeMap[props.size] || sizeMap.medium};
  height: ${props => sizeMap[props.size] || sizeMap.medium};
  background-color: var(--color-primary);
  border-radius: 50%;
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

// 점 인디케이터 컨테이너
const DotsIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &::before,
  &::after,
  & span {
    content: '';
    width: ${props => parseInt(sizeMap[props.size] || sizeMap.medium) / 3}px;
    height: ${props => parseInt(sizeMap[props.size] || sizeMap.medium) / 3}px;
    background-color: var(--color-primary);
    border-radius: 50%;
    animation: ${dots} 1.4s infinite ease-in-out both;
  }
  
  &::before {
    animation-delay: -0.32s;
  }
  
  & span {
    animation-delay: -0.16s;
  }
`;

Loading.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    type: PropTypes.oneOf(['spinner', 'dots', 'pulse']),
    text: PropTypes.string,
    fullScreen: PropTypes.bool,
};

export default Loading;