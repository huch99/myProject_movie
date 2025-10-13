// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Container from '../components/layout/Container';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import ROUTE_PATHS from '../constants/routePaths';

/**
 * 404 Not Found 페이지 컴포넌트
 */
const NotFoundPage = () => {
  return (
    <Container>
      <NotFoundContainer>
        <ErrorCode>404</ErrorCode>
        <ErrorIcon>
          <FaExclamationTriangle />
        </ErrorIcon>
        <ErrorTitle>페이지를 찾을 수 없습니다</ErrorTitle>
        <ErrorMessage>
          요청하신 페이지가 삭제되었거나, 이름이 변경되었거나, 일시적으로 사용할 수 없습니다.
        </ErrorMessage>
        
        <ActionButtons>
          <BackButton onClick={() => window.history.back()}>
            <FaArrowLeft />
            <span>이전 페이지로</span>
          </BackButton>
          <HomeButton to={ROUTE_PATHS.HOME}>
            <FaHome />
            <span>홈으로 이동</span>
          </HomeButton>
        </ActionButtons>
        
        <SuggestionSection>
          <SuggestionTitle>다음 페이지를 방문해보세요</SuggestionTitle>
          <SuggestionLinks>
            <SuggestionLink to={ROUTE_PATHS.MOVIES}>영화 목록</SuggestionLink>
            <SuggestionLink to={ROUTE_PATHS.THEATERS}>극장 안내</SuggestionLink>
            <SuggestionLink to={ROUTE_PATHS.MY_PAGE}>마이페이지</SuggestionLink>
          </SuggestionLinks>
        </SuggestionSection>
      </NotFoundContainer>
    </Container>
  );
};

// 스타일 컴포넌트
const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  text-align: center;
  min-height: 60vh;
`;

const ErrorCode = styled.div`
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  color: var(--color-warning);
  margin-bottom: var(--spacing-lg);
`;

const ErrorTitle = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const ErrorMessage = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin-bottom: var(--spacing-xl);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const HomeButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  text-decoration: none;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

const SuggestionSection = styled.div`
  margin-top: var(--spacing-lg);
`;

const SuggestionTitle = styled.h3`
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
`;

const SuggestionLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
`;

const SuggestionLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default NotFoundPage;