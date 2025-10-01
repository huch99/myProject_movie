import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Seat } from '../../types/booking.types';
import Button from '../common/Button';
import { useBooking } from '../../context/BookingContext';


const Container = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
`;

const SelectedInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const MoviePoster = styled.img`
  width: 60px;
  border-radius: 4px;
`;

const InfoDetails = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ScreeningInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 3px;
`;

const SelectionContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TicketTypeContainer = styled.div`
  flex: 0 0 250px;
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
  }
`;

const TicketTypeTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const TicketTypeGrid = styled.div`
  display: grid;
  gap: 15px;
`;

const TicketTypeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const TicketTypeLabel = styled.div`
  font-size: 0.9rem;
`;

const TicketTypePrice = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  width: 40px;
  text-align: center;
  font-size: 1rem;
`;

const SeatContainer = styled.div`
  flex: 1;
`;

const ScreenContainer = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const Screen = styled.div`
  height: 10px;
  background-color: #999;
  border-radius: 50%;
  margin: 0 auto 20px;
  width: 80%;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
`;

const ScreenLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const SeatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 30px);
  gap: 5px;
  justify-content: center;
  margin-bottom: 20px;
`;

const SeatItem = styled.div<{ status: string }>`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: ${props => props.status === 'available' || props.status === 'selected' ? 'pointer' : 'default'};
  background-color: ${props => {
        switch (props.status) {
            case 'available': return 'white';
            case 'occupied': return '#ddd';
            case 'selected': return '#e51937';
            case 'disabled': return 'transparent';
            default: return 'white';
        }
    }};
  border: ${props => {
        switch (props.status) {
            case 'available': return '1px solid #ddd';
            case 'occupied': return '1px solid #ccc';
            case 'selected': return '1px solid #e51937';
            case 'disabled': return 'none';
            default: return '1px solid #ddd';
        }
    }};
  color: ${props => props.status === 'selected' ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => {
        switch (props.status) {
            case 'available': return '#f1f1f1';
            case 'selected': return '#c41730';
            default: return props.status === 'disabled' ? 'transparent' : undefined;
        }
    }};
  }
`;

const SeatLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
`;

const LegendColor = styled.div<{ color: string; borderColor: string }>`
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background-color: ${props => props.color};
  border: 1px solid ${props => props.borderColor};
`;

const SummaryContainer = styled.div`
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
`;

const SummaryTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
`;

const TotalRow = styled(SummaryRow)`
  border-top: 1px solid #ddd;
  padding-top: 10px;
  font-weight: 600;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// 좌석 생성 함수
const generateSeats = (rows: number, cols: number, occupiedSeats: string[] = []): Seat[] => {
    const seats: Seat[] = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const rowLabel = rowLabels[i];
            const colNum = j + 1;
            const seatId = `${rowLabel}${colNum}`;

            // 복도 설정 (예: 가운데 2칸은 복도)
            const isCorridor = cols > 8 && (j === Math.floor(cols / 2) - 1 || j === Math.floor(cols / 2));

            if (!isCorridor) {
                seats.push({
                    id: seatId,
                    row: rowLabel,
                    column: colNum,
                    status: occupiedSeats.includes(seatId) ? 'occupied' : 'available',
                    seatType: 'regular'
                });
            } else {
                // 복도는 disabled 상태로 표시
                seats.push({
                    id: seatId,
                    row: rowLabel,
                    column: colNum,
                    status: 'disabled',
                    seatType: 'regular'
                });
            }
        }
    }

    return seats;
};

// 예시 데이터 (실제로는 API에서 가져옵니다)
const mockOccupiedSeats = ['A1', 'A2', 'B5', 'C7', 'D3', 'D4', 'E8', 'F2', 'G6', 'H1', 'H2'];

const SeatSelection: React.FC = () => {
    const { state, selectSeat, unselectSeat, setTicketType, calculatePrice, nextStep, prevStep } = useBooking();
    const { selectedMovie, selectedTheater, selectedScreening, selectedSeats, ticketTypes, totalPrice } = state;

    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedScreening) {
            setLoading(true);

            // 실제 API 호출 대신 목업 데이터 사용
            setTimeout(() => {
                // 상영관 정보에 따라 좌석 생성
                const mockSeats = generateSeats(10, 15, mockOccupiedSeats);
                setSeats(mockSeats);
                setLoading(false);
            }, 300);
        }
    }, [selectedScreening]);

    const handleTicketQuantityChange = (type: string, change: number) => {
        const currentCount = ticketTypes[type] || 0;
        const newCount = Math.max(0, currentCount + change);

        // 전체 티켓 수량 계산
        const totalTickets = Object.entries(ticketTypes)
            .reduce((sum, [t, count]) => sum + (t === type ? newCount : count), 0);

        // 최대 8매까지만 구매 가능
        if (totalTickets > 8) return;

        setTicketType(type, newCount);

        // 티켓 유형 변경 시 가격 다시 계산
        calculatePrice();
    };

    // 좌석 선택/취소 처리
    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'occupied' || seat.status === 'disabled') {
            return;
        }

        // 전체 티켓 수량 계산
        const totalTickets = Object.values(ticketTypes).reduce((sum, count) => sum + count, 0);

        if (totalTickets === 0) {
            alert('먼저 티켓 수량을 선택해 주세요.');
            return;
        }

        if (seat.status === 'selected') {
            // 이미 선택된 좌석 취소
            unselectSeat(seat);

            // 좌석 상태 업데이트
            setSeats(seats.map(s =>
                s.id === seat.id ? { ...s, status: 'available' } : s
            ));
        } else if (seat.status === 'available') {
            // 새 좌석 선택 (선택 가능한 좌석 수 체크)
            if (selectedSeats.length >= totalTickets) {
                alert(`최대 ${totalTickets}개의 좌석만 선택할 수 있습니다.`);
                return;
            }

            selectSeat(seat);

            // 좌석 상태 업데이트
            setSeats(seats.map(s =>
                s.id === seat.id ? { ...s, status: 'selected' } : s
            ));
        }
    };

    const handleContinue = () => {
        const totalTickets = Object.values(ticketTypes).reduce((sum, count) => sum + count, 0);

        if (selectedSeats.length !== totalTickets) {
            alert(`티켓 수량(${totalTickets}매)과 선택한 좌석 수(${selectedSeats.length}석)가 일치하지 않습니다.`);
            return;
        }

        calculatePrice();
        nextStep();
    };

    const handleBack = () => {
        prevStep();
    };

    // 날짜 및 시간 포맷 함수
    const formatDateTime = (timeString: string) => {
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

    if (!selectedMovie || !selectedTheater || !selectedScreening) {
        return (
            <Container>
                <Title>좌석 선택</Title>
                <div>영화, 극장, 상영 시간을 먼저 선택해 주세요.</div>
                <ButtonContainer>
                    <Button variant="outline" onClick={handleBack}>이전 단계로</Button>
                </ButtonContainer>
            </Container>
        );
    }
    return (
        <Container>
            <Title>좌석 선택</Title>

            <SelectedInfo>
                <MoviePoster src={selectedMovie.posterUrl} alt={selectedMovie.title} />
                <InfoDetails>
                    <MovieTitle>{selectedMovie.title}</MovieTitle>
                    <ScreeningInfo>
                        {selectedTheater.name} | {selectedScreening && formatDateTime(selectedScreening.startTime)}
                    </ScreeningInfo>
                    <ScreeningInfo>
                        선택한 좌석: {selectedSeats.map(seat => seat.id).join(', ') || '없음'}
                    </ScreeningInfo>
                </InfoDetails>
            </SelectedInfo>

            <SelectionContainer>
                <TicketTypeContainer>
                    <TicketTypeTitle>인원/좌석 선택</TicketTypeTitle>
                    <TicketTypeGrid>
                        <TicketTypeRow>
                            <TicketTypeLabel>성인</TicketTypeLabel>
                            <TicketTypePrice>14,000원</TicketTypePrice>
                            <QuantitySelector>
                                <QuantityButton
                                    onClick={() => handleTicketQuantityChange('adult', -1)}
                                    disabled={ticketTypes.adult <= 0}
                                >
                                    -
                                </QuantityButton>
                                <QuantityDisplay>{ticketTypes.adult || 0}</QuantityDisplay>
                                <QuantityButton
                                    onClick={() => handleTicketQuantityChange('adult', 1)}
                                >
                                    +
                                </QuantityButton>
                            </QuantitySelector>
                        </TicketTypeRow>

                        <TicketTypeRow>
                            <TicketTypeLabel>청소년</TicketTypeLabel>
                            <TicketTypePrice>12,000원</TicketTypePrice>
                            <QuantitySelector>
                                <QuantityButton
                                    onClick={() => handleTicketQuantityChange('teen', -1)}
                                    disabled={ticketTypes.teen <= 0}
                                >
                                    -
                                </QuantityButton>
                                <QuantityDisplay>{ticketTypes.teen || 0}</QuantityDisplay>
                                <QuantityButton
                                    onClick={() => handleTicketQuantityChange('teen', 1)}
                                >
                                    +
                                </QuantityButton>
                            </QuantitySelector>
                        </TicketTypeRow>

                        <TicketTypeRow>
                            <TicketTypeLabel>어린이</TicketTypeLabel>
                            <TicketTypePrice>8,000원</TicketTypePrice>
                            <QuantitySelector>
                                <QuantityButton
                                    onClick={() => handleTicketQuantityChange('child', -1)}
                                    disabled={ticketTypes.child <= 0}
                                >
                                    -
                                </QuantityButton>
                                <QuantityDisplay>{ticketTypes.child || 0}</QuantityDisplay>
                                <QuantityButton
                                    onClick={() => handleTicketQuantityChange('child', 1)}
                                >
                                    +
                                </QuantityButton>
                            </QuantitySelector>
                        </TicketTypeRow>
                    </TicketTypeGrid>

                    <SummaryContainer>
                        <SummaryTitle>결제 금액</SummaryTitle>

                        {ticketTypes.adult > 0 && (
                            <SummaryRow>
                                <span>성인 {ticketTypes.adult}명</span>
                                <span>{(14000 * ticketTypes.adult).toLocaleString()}원</span>
                            </SummaryRow>
                        )}

                        {ticketTypes.teen > 0 && (
                            <SummaryRow>
                                <span>청소년 {ticketTypes.teen}명</span>
                                <span>{(12000 * ticketTypes.teen).toLocaleString()}원</span>
                            </SummaryRow>
                        )}

                        {ticketTypes.child > 0 && (
                            <SummaryRow>
                                <span>어린이 {ticketTypes.child}명</span>
                                <span>{(8000 * ticketTypes.child).toLocaleString()}원</span>
                            </SummaryRow>
                        )}

                        <TotalRow>
                            <span>총 결제금액</span>
                            <span>{totalPrice.toLocaleString()}원</span>
                        </TotalRow>
                    </SummaryContainer>
                </TicketTypeContainer>

                <SeatContainer>
                    <ScreenContainer>
                        <Screen />
                        <ScreenLabel>SCREEN</ScreenLabel>
                    </ScreenContainer>

                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            좌석 정보를 불러오는 중...
                        </div>
                    ) : (
                        <>
                            <SeatsGrid>
                                {seats.map(seat => (
                                    <SeatItem
                                        key={seat.id}
                                        status={seat.status}
                                        onClick={() => handleSeatClick(seat)}
                                    >
                                        {seat.status !== 'disabled' ? seat.id : ''}
                                    </SeatItem>
                                ))}
                            </SeatsGrid>

                            <SeatLegend>
                                <LegendItem>
                                    <LegendColor color="white" borderColor="#ddd" />
                                    <span>선택 가능</span>
                                </LegendItem>
                                <LegendItem>
                                    <LegendColor color="#e51937" borderColor="#e51937" />
                                    <span>선택한 좌석</span>
                                </LegendItem>
                                <LegendItem>
                                    <LegendColor color="#ddd" borderColor="#ccc" />
                                    <span>예매된 좌석</span>
                                </LegendItem>
                            </SeatLegend>
                        </>
                    )}
                </SeatContainer>
            </SelectionContainer>

            <ButtonContainer>
                <Button variant="outline" onClick={handleBack}>
                    이전 단계로
                </Button>
                <Button
                    variant="primary"
                    disabled={selectedSeats.length === 0 ||
                        Object.values(ticketTypes).reduce((sum, count) => sum + count, 0) === 0 ||
                        selectedSeats.length !== Object.values(ticketTypes).reduce((sum, count) => sum + count, 0)}
                    onClick={handleContinue}
                >
                    다음 단계로
                </Button>
            </ButtonContainer>
        </Container>
    );
};

export default SeatSelection;