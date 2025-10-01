// src/components/booking/BookingComplete.tsx
import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Button from '../common/Button';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  font-weight: 600;
  color: #e51937;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: #666;
`;

const CompletionBox = styled.div`
  background-color: #f8f8f8;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  text-align: left;
  margin-bottom: 30px;
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
  font-size: 1.1rem;
  font-weight: 500;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 20px 0;
`;

const TotalAmount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const TotalText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
`;

// src/components/booking/BookingComplete.tsx (이어서)
const TotalPrice = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #e51937;
`;

const NoticeBox = styled.div`
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 30px;
`;

const NoticeTitle = styled.div`
  font-weight: 600;
  margin-bottom: 10px;
  color: #e51937;
`;

const NoticeText = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

interface BookingCompleteState {
    movieTitle?: string;
    theaterName?: string;
    screeningTime?: string;
    seats?: string;
    totalAmount?: number;
}

const BookingComplete: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 페이지 상태 확인
    const state = location.state as BookingCompleteState;

    // 예매 정보가 없으면 홈으로 리다이렉트
    if (!state || !state.movieTitle) {
        return <Navigate to="/" replace />;
    }

    // 날짜 및 시간 포맷 함수
    const formatDateTime = (timeString: string | undefined) => {
        if (!timeString) return '';

        const date = new Date(timeString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;

        return `${year}.${month}.${day} ${ampm} ${formattedHours}:${minutes.toString().padStart(2, '0')}`;
    };

    // 예매 번호 생성 (실제로는 서버에서 받아옴)
    const bookingNumber = `MV${Math.floor(Math.random() * 9000000) + 1000000}`;

    return (
        <Container>
            <Title>예매가 완료되었습니다!</Title>
            <Subtitle>즐거운 관람 되세요.</Subtitle>

            <CompletionBox>
                <InfoGrid>
                    <InfoItem>
                        <InfoLabel>예매 번호</InfoLabel>
                        <InfoValue>{bookingNumber}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>영화</InfoLabel>
                        <InfoValue>{state.movieTitle}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>극장</InfoLabel>
                        <InfoValue>{state.theaterName}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>상영 일시</InfoLabel>
                        <InfoValue>{formatDateTime(state.screeningTime)}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>좌석</InfoLabel>
                        <InfoValue>{state.seats}</InfoValue>
                    </InfoItem>
                </InfoGrid>

                <Divider />

                <TotalAmount>
                    <TotalText>결제 금액</TotalText>
                    <TotalPrice>{state.totalAmount?.toLocaleString()}원</TotalPrice>
                </TotalAmount>
            </CompletionBox>

            <NoticeBox>
                <NoticeTitle>예매 안내</NoticeTitle>
                <NoticeText>• 상영시간 20분 전까지 취소 가능하며, 그 이후에는 취소 및 환불이 불가합니다.</NoticeText>
                <NoticeText>• 예매내역은 '마이페이지 &gt; 예매 내역'에서 확인하실 수 있습니다.</NoticeText>
                <NoticeText>• 상영관에 음식물 반입은 극장의 정책에 따라 제한될 수 있습니다.</NoticeText>
                <NoticeText>• 상영 시작 후에는 입장이 제한될 수 있으니 시간을 엄수해 주시기 바랍니다.</NoticeText>
            </NoticeBox>

            <ButtonGroup>
                <Button variant="outline" onClick={() => navigate('/mypage/bookings')}>
                    예매 내역 확인
                </Button>
                <Button variant="primary" onClick={() => navigate('/')}>
                    홈으로 돌아가기
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default BookingComplete;
