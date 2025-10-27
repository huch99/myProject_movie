import React from 'react';
import styled from 'styled-components';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const TheaterInfo = ({ theater, isFavorite, onFavoriteToggle, onReservation }) => {
  return (
    <TheaterInfoContainer>
      <TheaterTitle>{theater.name}</TheaterTitle>
      <TheaterAddress>{theater.address}</TheaterAddress>

      <TheaterMetaInfo>
        <span>{theater.phone}</span>
        <Divider>|</Divider>
        <span>{theater.totalScreens}개 상영관</span>
        <Divider>|</Divider>
        <span>{theater.totalSeats}석</span>
      </TheaterMetaInfo>

      <ActionButtons>
        <FavoriteButton onClick={onFavoriteToggle} isFavorite={isFavorite}>
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
          <span>{isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}</span>
        </FavoriteButton>

        <ReservationButton onClick={onReservation}>
          예매하기
        </ReservationButton>
      </ActionButtons>
    </TheaterInfoContainer>
  );
};

// Styled Components
const TheaterInfoContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const TheaterTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
`;

const TheaterAddress = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
`;

const TheaterMetaInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const Divider = styled.span`
  margin: 0 8px;
  color: #ddd;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const FavoriteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid ${props => props.isFavorite ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  background-color: ${props => props.isFavorite ? '#ffeeee' : '#fff'};
  color: ${props => props.isFavorite ? '#e74c3c' : '#666'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.isFavorite ? '#ffe0e0' : '#f5f5f5'};
  }
  
  svg {
    color: ${props => props.isFavorite ? '#e74c3c' : '#666'};
  }
`;

const ReservationButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

export default TheaterInfo;