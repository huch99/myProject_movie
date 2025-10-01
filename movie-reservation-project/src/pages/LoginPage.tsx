import React from 'react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import LoginForm from '../components/user/LoginForm';

const Container = styled.div`
  max-width: 500px;
  margin: 60px auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 30px;
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  margin-top: 15px;
  color: #666;
  font-size: 0.9rem;
  text-decoration: none;
  
  &:hover {
    color: #e51937;
    text-decoration: underline;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  
  a {
    color: #e51937;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SocialLoginSection = styled.div`
  margin-top: 40px;
`;

const SocialLoginTitle = styled.div`
  text-align: center;
  position: relative;
  margin-bottom: 20px;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #eee;
    z-index: -1;
  }
  
  span {
    background-color: #fff;
    padding: 0 15px;
    color: #999;
    font-size: 0.9rem;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const SocialButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
  
  img {
    width: 24px;
    height: 24px;
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/'); // 로그인 성공 시 홈으로 이동
  };

  return (
    <Container>
      <Title>로그인</Title>
      
      <LoginForm onSuccess={handleLoginSuccess} />
      
      <ForgotPassword to="/forgot-password">비밀번호를 잊으셨나요?</ForgotPassword>
      
      <RegisterLink>
        계정이 없으신가요? <Link to="/register">회원가입</Link>
      </RegisterLink>
      
      <SocialLoginSection>
        <SocialLoginTitle>
          <span>또는</span>
        </SocialLoginTitle>
        
        <SocialButtons>
          <SocialButton>
            <img src="/assets/icons/kakao.png" alt="카카오 로그인" />
          </SocialButton>
          <SocialButton>
            <img src="/assets/icons/naver.png" alt="네이버 로그인" />
          </SocialButton>
          <SocialButton>
            <img src="/assets/icons/google.png" alt="구글 로그인" />
          </SocialButton>
        </SocialButtons>
      </SocialLoginSection>
    </Container>
  );
};

export default LoginPage;