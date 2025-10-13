// src/components/common/LoadingScreen.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFilm } from 'react-icons/fa';

/**
 * 애플리케이션 전체 로딩 화면 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.text - 로딩 메시지 (기본값: "로딩 중입니다...")
 */
const LoadingScreen = ({ text = "로딩 중입니다..." }) => {
    return (
        <LoadingContainer>
            <LoadingContent>
                <IconWrapper>
                    <FaFilm size={40} />
                </IconWrapper>
                <Spinner />
                <LoadingText>{text}</LoadingText>
            </LoadingContent>
        </LoadingContainer>
    );
};

// 애니메이션 정의
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// 스타일 컴포넌트
const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-surface, white);
  border-radius: var(--border-radius-lg, 8px);
  box-shadow: var(--box-shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
`;

const IconWrapper = styled.div`
  margin-bottom: 1rem;
  color: var(--color-primary, #e51937);
  animation: ${pulse} 2s infinite ease-in-out;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary, #e51937);
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  font-size: var(--font-size-md, 1rem);
  color: var(--color-text-primary, #333);
  font-weight: 500;
`;

export default LoadingScreen;