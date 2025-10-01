// src/components/booking/Ticket.tsx
import React from 'react';
import styled from 'styled-components';
import type { Ticket as TicketType } from '../../types/booking.types';

const QRCode = require('qrcode.react').QRCode;

interface TicketProps {
  ticket: TicketType;
  movie: {
    title: string;
    posterUrl: string;
  };
  theater: {
    name: string;
    screen: string;
  };
  screening: {
    startTime: string;
  };
}

const TicketContainer = styled.div`
  width: 100%;
  max-width: 350px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  position: relative;
`;

const TicketHeader = styled.div`
  background-color: #e51937;
  color: white;
  padding: 15px;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
`;

const TicketContent = styled.div`
  padding: 20px;
`;

const MovieInfo = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const PosterContainer = styled.div`
  width: 80px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MovieDetails = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 2px;
`;

const InfoValue = styled.span`
  font-size: 0.95rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed #ddd;
  margin: 20px 0;
`;

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
`;

const BookingNumber = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 10px 0;
`;

const TicketFooter = styled.div`
  padding: 10px;
  text-align: center;
  font-size: 0.8rem;
  color: #666;
  background-color: #f8f8f8;
`;

const Ticket: React.FC<TicketProps> = ({ ticket, movie, theater, screening }) => {
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };
  
  // QR 코드 데이터 생성
  const qrData = JSON.stringify({
    ticketId: ticket.id,
    movieId: movie.title,
    seats: ticket.seats.join(','),
    time: screening.startTime,
  });
  
  return (
    <TicketContainer>
      <TicketHeader>입장권</TicketHeader>
      <TicketContent>
        <MovieInfo>
          <PosterContainer>
            <Poster src={movie.posterUrl} alt={movie.title} />
          </PosterContainer>
          <MovieDetails>
            <MovieTitle>{movie.title}</MovieTitle>
            <InfoItem>
              <InfoLabel>극장/상영관</InfoLabel>
              <InfoValue>{theater.name} / {theater.screen}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>상영 일시</InfoLabel>
              <InfoValue>{formatDate(screening.startTime)}</InfoValue>
            </InfoItem>
          </MovieDetails>
        </MovieInfo>
        
        <InfoGrid>
          <InfoItem>
            <InfoLabel>좌석</InfoLabel>
            <InfoValue>{ticket.seats.join(', ')}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>인원</InfoLabel>
            <InfoValue>
              {ticket.ticketTypes.adult > 0 && `성인 ${ticket.ticketTypes.adult}명 `}
              {ticket.ticketTypes.teen > 0 && `청소년 ${ticket.ticketTypes.teen}명 `}
              {ticket.ticketTypes.child > 0 && `어린이 ${ticket.ticketTypes.child}명`}
            </InfoValue>
          </InfoItem>
        </InfoGrid>
        
        <Divider />
        
        <QRContainer>
          <QRCode value={qrData} size={120} />
          <BookingNumber>예매번호: {ticket.id}</BookingNumber>
        </QRContainer>
      </TicketContent>
      
      <TicketFooter>
        본 티켓은 상영시간 20분 전까지 입장해 주세요.
      </TicketFooter>
    </TicketContainer>
  );
};

export default Ticket;