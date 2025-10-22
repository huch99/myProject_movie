import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import LoginForm from '../components/user/LoginForm';
import Container from '../components/layout/Container';
import PageTitle from '../components/common/PageTitle';
import Alert from '../components/common/Alert';
import { FaSignInAlt } from 'react-icons/fa';
import ROUTE_PATHS from '../constants/routePaths';

/**
 * 로그인 페이지 컴포넌트
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  // 로그인 성공 후 리다이렉트할 경로
  const from = location.state?.from || '/';
  // 표시할 메시지 (회원가입 성공 등)
  const message = location.state?.message || '';

  const [showMessage, setShowMessage] = useState(!!message);

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (isAuthenticated && token) {
      navigate(ROUTE_PATHS.HOME);
    }
  }, [isAuthenticated, navigate]);

  // 메시지 닫기 핸들러
  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <Container>
      <LoginContainer>
        {showMessage && message && (
          <Alert
            message={message}
            type="success"
            onClose={handleCloseMessage}
            autoClose={5000}
          />
        )}

        <PageTitle>
          <TitleIcon>
            <FaSignInAlt />
          </TitleIcon>
          <span>로그인</span>
        </PageTitle>

        <LoginFormWrapper>
          <LoginForm />
        </LoginFormWrapper>

        <LoginHelp>
          <HelpText>
            로그인에 문제가 있으신가요? <HelpLink href="/help">고객센터</HelpLink>에 문의하세요.
          </HelpText>
        </LoginHelp>
      </LoginContainer>
    </Container>
  );
};

// 스타일 컴포넌트
const LoginContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
`;

const TitleIcon = styled.span`
  margin-right: var(--spacing-sm);
  color: var(--color-primary);
`;

const LoginFormWrapper = styled.div`
  margin: var(--spacing-lg) 0;
`;

const LoginHelp = styled.div`
  text-align: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
`;

const HelpText = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const HelpLink = styled.a`
  color: var(--color-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginPage;