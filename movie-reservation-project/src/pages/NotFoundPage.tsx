import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 80px auto;
  padding: 0 20px;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: #e51937;
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 20px 0 30px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: #e51937;
  color: white;
  font-weight: 500;
  border-radius: 4px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c41730;
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>페이지를 찾을 수 없습니다</Title>
      <Description>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.<br />
        URL을 확인하시거나 아래 버튼을 눌러 홈페이지로 이동해 주세요.
      </Description>
      <HomeLink to="/">홈으로 돌아가기</HomeLink>
    </Container>
  );
};

export default NotFoundPage;