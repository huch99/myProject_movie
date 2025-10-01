// src/components/user/MyPageComponent.tsx
import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import type { User } from '../../types/user.types';

interface MyPageComponentProps {
  user: User;
  onEditClick: () => void;
  onChangePasswordClick: () => void;
}

const Container = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const UserInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const InfoItem = styled.div`
  margin-bottom: 15px;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const MyPageComponent: React.FC<MyPageComponentProps> = ({
  user,
  onEditClick,
  onChangePasswordClick,
}) => {
  return (
    <Container>
      <SectionTitle>회원 정보</SectionTitle>
      <UserInfoGrid>
        <InfoItem>
          <InfoLabel>이름</InfoLabel>
          <InfoValue>{user.name}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>이메일</InfoLabel>
          <InfoValue>{user.email}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>휴대폰 번호</InfoLabel>
          <InfoValue>{user.phone}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>생년월일</InfoLabel>
          <InfoValue>{user.birthdate}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>회원 등급</InfoLabel>
          <InfoValue>{user.membership}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>보유 포인트</InfoLabel>
          <InfoValue>{user.points.toLocaleString()}P</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>가입일</InfoLabel>
          <InfoValue>{user.joinDate}</InfoValue>
        </InfoItem>
      </UserInfoGrid>
      
      <ButtonGroup>
        <Button variant="outline" onClick={onEditClick}>
          회원정보 수정
        </Button>
        <Button variant="outline" onClick={onChangePasswordClick}>
          비밀번호 변경
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default MyPageComponent;