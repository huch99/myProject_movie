// src/components/common/ErrorMessage.jsx
import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * 오류 메시지를 표시하는 컴포넌트
 * @param {Object} props
 * @param {string} props.message - 표시할 오류 메시지
 * @param {Function} props.onRetry - 재시도 버튼 클릭 시 실행할 함수 (선택 사항)
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <ErrorContainer>
      <ErrorIcon>
        <FaExclamationTriangle />
      </ErrorIcon>
      <ErrorText>{message || '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'}</ErrorText>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          다시 시도
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

// 스타일 컴포넌트
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 1rem 0;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.error};
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const RetryButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${props => props.theme.colors.button.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: ${props => props.theme.transition.default};

  &:hover {
    background-color: ${props => props.theme.colors.primary}e6;
  }
`;

export default ErrorMessage;