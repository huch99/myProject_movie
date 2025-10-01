import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Screening } from '../../types/booking.types';
import { useBooking } from '../../context/BookingContext';
import Button from '../common/Button';

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

const TheaterInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const SelectionContainer = styled.div`
  margin-bottom: 30px;
`;

const DateSelector = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const DateItem = styled.div<{ active: boolean }>`
  flex: 0 0 80px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${props => props.active ? '#e51937' : '#f1f1f1'};
  color: ${props => props.active ? 'white' : '#333'};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#e51937' : '#e1e1e1'};
  }
`;

const DayOfWeek = styled.div`
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const DayOfMonth = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const ScreeningContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const ScreenHeader = styled.div`
  padding: 12px 15px;
  background-color: #f5f5f5;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  padding: 15px;
`;

const TimeItem = styled.div<{ active: boolean; available: boolean }>`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.active ? '#e51937' : '#ddd'};
  background-color: ${props => props.active ? '#e51937' : props.available ? 'white' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : props.available ? '#333' : '#999'};
  text-align: center;
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  transition: all 0.2s;

   &:hover {
    background-color: ${props => props.active ? '#e51937' : props.available ? '#f1f1f1' : '#f5f5f5'};
  }
`;

const StartTime = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

const ScreenInfo = styled.div`
  font-size: 0.8rem;
  color: ${props => props.color || '#666'};
`;

const SeatsInfo = styled.div`
  font-size: 0.8rem;
  color: ${props => props.color || '#666'};
`;

const NoScreenings = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// 날짜 생성 유틸리티 함수
const generateDates = (days: number) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        dates.push({
            dateString: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            dayOfMonth: day,
            dayOfWeek,
            isWeekend,
        });
    }

    return dates;
};

// 예시 데이터 (실제로는 API에서 가져옵니다)
const mockScreenings: { [key: string]: Screening[] } = {
    '2025-10-01': [
        {
            id: 1,
            movieId: 1,
            screenId: 1,
            theaterId: 1,
            startTime: '2025-10-01T10:30:00',
            endTime: '2025-10-01T12:36:00',
            price: 14000,
            availableSeats: 120,
        },
        {
            id: 2,
            movieId: 1,
            screenId: 2,
            theaterId: 1,
            startTime: '2025-10-01T13:00:00',
            endTime: '2025-10-01T15:06:00',
            price: 14000,
            availableSeats: 80,
        },
        {
            id: 3,
            movieId: 1,
            screenId: 1,
            theaterId: 1,
            startTime: '2025-10-01T15:30:00',
            endTime: '2025-10-01T17:36:00',
            price: 14000,
            availableSeats: 150,
        },
        {
            id: 4,
            movieId: 1,
            screenId: 3,
            theaterId: 1,
            startTime: '2025-10-01T18:00:00',
            endTime: '2025-10-01T20:06:00',
            price: 14000,
            availableSeats: 0, // 매진
        },
        {
            id: 5,
            movieId: 1,
            screenId: 1,
            theaterId: 1,
            startTime: '2025-10-01T20:30:00',
            endTime: '2025-10-01T22:36:00',
            price: 14000,
            availableSeats: 100,
        },
    ],
    '2025-10-02': [
        {
            id: 6,
            movieId: 1,
            screenId: 1,
            theaterId: 1,
            startTime: '2025-10-02T11:00:00',
            endTime: '2025-10-02T13:06:00',
            price: 14000,
            availableSeats: 140,
        },
        {
            id: 7,
            movieId: 1,
            screenId: 2,
            theaterId: 1,
            startTime: '2025-10-02T14:30:00',
            endTime: '2025-10-02T16:36:00',
            price: 14000,
            availableSeats: 95,
        },
        {
            id: 8,
            movieId: 1,
            screenId: 1,
            theaterId: 1,
            startTime: '2025-10-02T17:00:00',
            endTime: '2025-10-02T19:06:00',
            price: 14000,
            availableSeats: 120,
        },
        {
            id: 9,
            movieId: 1,
            screenId: 3,
            theaterId: 1,
            startTime: '2025-10-02T19:30:00',
            endTime: '2025-10-02T21:36:00',
            price: 14000,
            availableSeats: 85,
        },
    ],
    // 다른 날짜의 상영 정보도 추가...
};

// 스크린 정보 (실제로는 API에서 가져옵니다)
const mockScreens = {
    1: { id: 1, name: '1관', theaterId: 1, seatRows: 15, seatColumns: 20 },
    2: { id: 2, name: '2관 (IMAX)', theaterId: 1, seatRows: 12, seatColumns: 18, specialType: 'IMAX' as const },
    3: { id: 3, name: '3관 (4DX)', theaterId: 1, seatRows: 10, seatColumns: 15, specialType: '4DX' as const },
};

const DateTimeSelection: React.FC = () => {
    const { state, selectDate, selectScreening, nextStep, prevStep } = useBooking();
    const { selectedMovie, selectedTheater } = state;

    const [dates, setDates] = useState(generateDates(14)); // 오늘부터 2주일간의 날짜
    const [selectedDateString, setSelectedDateString] = useState<string>(dates[0].dateString);
    const [screenings, setScreenings] = useState<Screening[]>([]);
    const [loading, setLoading] = useState(false);

    // 날짜 선택 시 해당 날짜의 상영 정보 불러오기
    useEffect(() => {
        if (selectedDateString && selectedMovie && selectedTheater) {
            setLoading(true);
            selectDate(selectedDateString);

            // 실제 API 호출 대신 목업 데이터 사용
            setTimeout(() => {
                setScreenings(mockScreenings[selectedDateString] || []);
                setLoading(false);
            }, 300);
        }
    }, [selectedDateString, selectedMovie, selectedTheater, selectDate]);

    const handleDateSelect = (dateString: string) => {
        setSelectedDateString(dateString);
    };

    const handleScreeningSelect = (screening: Screening) => {
        // 매진된 상영 시간은 선택할 수 없음
        if (screening.availableSeats <= 0) return;

        selectScreening(screening);
    };

    const handleContinue = () => {
        if (state.selectedScreening) {
            nextStep();
        }
    };

    const handleBack = () => {
        prevStep();
    };

    // 시간 포맷 함수 (24시간 -> 12시간)
    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;

        return `${ampm} ${formattedHours}:${minutes.toString().padStart(2, '0')}`;
    };

    if (!selectedMovie || !selectedTheater) {
        return (
            <Container>
                <Title>날짜/시간 선택</Title>
                <div>영화와 극장을 먼저 선택해 주세요.</div>
                <ButtonContainer>
                    <Button variant="outline" onClick={handleBack}>이전 단계로</Button>
                </ButtonContainer>
            </Container>
        );
    }

    return (
        <Container>
            <Title>날짜/시간 선택</Title>

            <SelectedInfo>
                <MoviePoster src={selectedMovie.posterUrl} alt={selectedMovie.title} />
                <InfoDetails>
                    <MovieTitle>{selectedMovie.title}</MovieTitle>
                    <TheaterInfo>
                        {selectedTheater.name} | {selectedTheater.location}
                    </TheaterInfo>
                </InfoDetails>
            </SelectedInfo>

            <SelectionContainer>
                <DateSelector>
                    {dates.map((date) => (
                        <DateItem
                            key={date.dateString}
                            active={selectedDateString === date.dateString}
                            onClick={() => handleDateSelect(date.dateString)}
                        >
                            <DayOfWeek style={{ color: date.isWeekend ? '#e51937' : undefined }}>
                                {date.dayOfWeek}
                            </DayOfWeek>
                            <DayOfMonth>{date.dayOfMonth}</DayOfMonth>
                        </DateItem>
                    ))}
                </DateSelector>

                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        상영 정보를 불러오는 중...
                    </div>
                ) : screenings.length > 0 ? (
                    <ScreeningContainer>
                        <ScreenHeader>상영 시간</ScreenHeader>
                        <TimeGrid>
                            {screenings.map(screening => {
                                const screenInfo = mockScreens[screening.screenId as keyof typeof mockScreens];
                                const isAvailable = screening.availableSeats > 0;
                                const isSelected = state.selectedScreening?.id === screening.id;

                                return (
                                    <TimeItem
                                        key={screening.id}
                                        active={isSelected}
                                        available={isAvailable}
                                        onClick={() => isAvailable && handleScreeningSelect(screening)}
                                    >
                                        <StartTime>{formatTime(screening.startTime)}</StartTime>
                                        <ScreenInfo color={isSelected ? 'rgba(255, 255, 255, 0.8)' : undefined}>
                                            {screenInfo?.name || `${screening.screenId}관`}
                                        </ScreenInfo>
                                        <SeatsInfo color={isSelected ? 'rgba(255, 255, 255, 0.8)' : undefined}>
                                            {isAvailable
                                                ? `잔여 ${screening.availableSeats}석`
                                                : '매진'}
                                        </SeatsInfo>
                                    </TimeItem>
                                );
                            })}
                        </TimeGrid>
                    </ScreeningContainer>
                ) : (
                    <NoScreenings>
                        선택한 날짜에 상영 정보가 없습니다. 다른 날짜를 선택해 주세요.
                    </NoScreenings>
                )}
            </SelectionContainer>

            <ButtonContainer>
                <Button variant="outline" onClick={handleBack}>
                    이전 단계로
                </Button>
                <Button
                    variant="primary"
                    disabled={!state.selectedScreening}
                    onClick={handleContinue}
                >
                    다음 단계로
                </Button>
            </ButtonContainer>
        </Container>
    );
};

export default DateTimeSelection;