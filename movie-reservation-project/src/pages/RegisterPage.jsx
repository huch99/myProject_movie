import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import RegisterForm from '../components/user/RegisterForm';
import Container from '../components/layout/Container';
import PageTitle from '../components/common/PageTitle';
import Alert from '../components/common/Alert';
import { FaUserPlus } from 'react-icons/fa';
import ROUTE_PATHS from '../constants/routePaths';

/**
 * 회원가입 페이지 컴포넌트
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // 표시할 메시지 (예: 관리자 초대 메시지 등)
  const message = location.state?.message || '';
  
  const [showMessage, setShowMessage] = useState(!!message);
  
  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTE_PATHS.HOME);
    }
  }, [isAuthenticated, navigate]);
  
  // 메시지 닫기 핸들러
  const handleCloseMessage = () => {
    setShowMessage(false);
  };
  
  return (
    <Container>
      <RegisterContainer>
        {showMessage && message && (
          <Alert 
            message={message} 
            type="info" 
            onClose={handleCloseMessage}
            autoClose={5000}
          />
        )}
        
        <PageTitle>
          <TitleIcon>
            <FaUserPlus />
          </TitleIcon>
          <span>회원가입</span>
        </PageTitle>
        
        <RegisterFormWrapper>
          <RegisterForm />
        </RegisterFormWrapper>
        
        <RegisterHelp>
          <HelpText>
            회원가입에 도움이 필요하시면 <HelpLink href="/help">고객센터</HelpLink>로 문의해주세요.
          </HelpText>
        </RegisterHelp>
      </RegisterContainer>
    </Container>
  );
};

// 스타일 컴포넌트
const RegisterContainer = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
`;

const TitleIcon = styled.span`
  margin-right: var(--spacing-sm);
  color: var(--color-primary);
`;

const RegisterFormWrapper = styled.div`
  margin: var(--spacing-lg) 0;
`;

const RegisterHelp = styled.div`
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

export default RegisterPage;