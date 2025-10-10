import React from 'react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/user/RegisterForm';
import type { RegisterFormData } from '../types/user.types';

const Container = styled.div`
  max-width: 600px;
  margin: 60px auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 30px;
`;

const LoginLink = styled.div`
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


const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
  const { register, loading, error } = useAuth(); // useAuth 훅에서 register 함수, loading, error 가져오기
  
  const handleRegisterSubmit = async (formData: RegisterFormData) => {
    try {
      await register(formData.name, formData.email, formData.password); // useAuth 훅의 register 함수 호출
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
      // useAuth 훅에서 에러가 설정되므로, 여기서 특별히 할 일은 없습니다.
      // RegisterForm에서 useAuth의 error prop을 받아서 표시할 것입니다.
    }
  };

return (
     <Container>
      <Title>회원가입</Title>
      
      <RegisterForm 
        onSubmit={handleRegisterSubmit} 
        isLoading={loading} // useAuth의 로딩 상태 전달
        error={error} // useAuth의 에러 메시지 전달
      />
      
      <LoginLink>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </LoginLink>
    </Container>
);
};

export default RegisterPage;