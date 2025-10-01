import React from 'react';
import styled from 'styled-components';
import type { Ticket } from '../../types/booking.types';
import Button from '../common/Button';

interface BookingHistoryProps {
    bookings: Ticket[];
    onCancelBooking: (bookingId: number) => void;
    onViewDetails: (bookingId: number) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BookingCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
`;

const BookingStatus = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  background-color: ${props => {
        switch (props.status) {
            case 'completed': return '#4caf50';
            case 'cancelled': return '#f44336';
            case 'pending': return '#ff9800';
            default: return '#999';
        }
    }};
`;

const BookingContent = styled.div`
  padding: 15px;
`;

const MovieInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const MoviePoster = styled.img`
  width: 100px;
  border-radius: 4px;
`;

const MovieDetails = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const BookingInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 3px;
`;

const InfoValue = styled.div`
  font-size: 0.95rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
`;

const BookingHistory: React.FC<BookingHistoryProps> = ({
    bookings,
    onCancelBooking,
    onViewDetails,
}) => {
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

    // 예매 상태 텍스트 변환
    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return '예매 완료';
            case 'cancelled': return '예매 취소';
            case 'pending': return '결제 대기';
            default: return '알 수 없음';
        }
    };

    if (bookings.length === 0) {
        return (
            <EmptyState>
                <p>예매 내역이 없습니다.</p>
            </EmptyState>
        );
    }
    return (
        <Container>
      {bookings.map(booking => {
        const screeningDate = new Date(booking.screening?.startTime || '');
        const now = new Date();
        const isPast = screeningDate < now;
        const isCancelled = booking.paymentStatus === 'cancelled';
        const canCancel = !isPast && !isCancelled && booking.paymentStatus === 'completed';
        
        return (
          <BookingCard key={booking.id}>
            <BookingHeader>
              <div>예매번호: {booking.id}</div>
              <BookingStatus status={booking.paymentStatus}>
                {getStatusText(booking.paymentStatus)}
              </BookingStatus>
            </BookingHeader>
            
            <BookingContent>
              <MovieInfo>
                <MoviePoster src={booking.movie?.posterUrl} alt={booking.movie?.title} />
                <MovieDetails>
                  <MovieTitle>{booking.movie?.title}</MovieTitle>
                  <InfoItem>
                    <InfoLabel>극장/상영관</InfoLabel>
                    <InfoValue>{booking.theater?.name} / {booking.theater?.screen}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>상영 일시</InfoLabel>
                    <InfoValue>{formatDate(booking.screening?.startTime || '')}</InfoValue>
                  </InfoItem>
                </MovieDetails>
              </MovieInfo>
              
              <BookingInfo>
                <InfoItem>
                  <InfoLabel>좌석</InfoLabel>
                  <InfoValue>{booking.seats.join(', ')}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>인원</InfoLabel>
                  <InfoValue>
                    {booking.ticketTypes.adult > 0 && `성인 ${booking.ticketTypes.adult}명 `}
                    {booking.ticketTypes.teen > 0 && `청소년 ${booking.ticketTypes.teen}명 `}
                    {booking.ticketTypes.child > 0 && `어린이 ${booking.ticketTypes.child}명`}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>결제 금액</InfoLabel>
                  <InfoValue>{booking.totalPrice.toLocaleString()}원</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>예매 일시</InfoLabel>
                  <InfoValue>{formatDate(booking.bookingDate)}</InfoValue>
                </InfoItem>
              </BookingInfo>
              
              <ButtonGroup>
                {canCancel && (
                  <Button 
                    variant="outline" 
                    onClick={() => onCancelBooking(booking.id)}
                  >
                    예매 취소
                  </Button>
                )}
                <Button 
                  variant={canCancel ? 'primary' : 'outline'}
                  onClick={() => onViewDetails(booking.id)}
                >
                  예매 상세
                </Button>
              </ButtonGroup>
            </BookingContent>
          </BookingCard>
        );
      })}
    </Container>
    );
};

export default BookingHistory;