import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { checkSeatAvailability } from '../../store/slices/reservationSlice';
import { SEAT_STATUS } from '../../styles/variables';


/**
 * 영화 예매를 위한 좌석 선택 컴포넌트
 * 
 * @param {Object} props
 * @param {number} props.screeningId - 상영 ID
 * @param {Array} props.selectedSeats - 선택된 좌석 배열
 * @param {Function} props.onSeatSelect - 좌석 선택 시 호출할 함수
 * @param {number} props.maxSeats - 최대 선택 가능한 좌석 수
 */
const SeatSelector = ({
    screeningId,
    selectedSeats = [],
    onSeatSelect,
    maxSeats = 8
}) => {
    const dispatch = useDispatch();
    const [availableSeats, setAvailableSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 좌석 정보 가져오기
    useEffect(() => {
        const fetchSeats = async () => {
            if (!screeningId) return;

            try {
                setLoading(true);
                setError(null);

                const response = await dispatch(checkSeatAvailability(screeningId)).unwrap();

                // 좌석 데이터 처리
                const available = response.availableSeats || [];
                const occupied = response.occupiedSeats || [];

                setAvailableSeats(available);
                setOccupiedSeats(occupied);
            } catch (err) {
                setError('좌석 정보를 불러오는데 실패했습니다.');
                console.error('좌석 정보 로딩 오류:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSeats();
    }, [dispatch, screeningId]);

    // 좌석 선택 핸들러
    const handleSeatClick = (seat) => {
        // 이미 예약된 좌석은 선택 불가
        if (occupiedSeats.some(s => s.id === seat.id)) {
            return;
        }

        // 이미 선택된 좌석이면 선택 취소
        const isSelected = selectedSeats.some(s => s.id === seat.id);

        // 최대 선택 가능 좌석 수 체크
        if (!isSelected && selectedSeats.length >= maxSeats) {
            alert(`최대 ${maxSeats}개의 좌석만 선택할 수 있습니다.`);
            return;
        }

        // 부모 컴포넌트에 선택 이벤트 전달
        onSeatSelect(seat);
    };

    // 좌석 상태 확인 함수
    const getSeatStatus = (seat) => {
        if (selectedSeats.some(s => s.id === seat.id)) {
            return SEAT_STATUS.SELECTED;
        }

        if (occupiedSeats.some(s => s.id === seat.id)) {
            return SEAT_STATUS.OCCUPIED;
        }

        if (seat.disabled) {
            return SEAT_STATUS.DISABLED;
        }

        return SEAT_STATUS.AVAILABLE;
    };

    // 좌석 레이아웃 생성
    const generateSeatLayout = () => {
        // 좌석이 없는 경우
        if (availableSeats.length === 0 && occupiedSeats.length === 0) {
            return <NoSeatsMessage>좌석 정보가 없습니다.</NoSeatsMessage>;
        }

        // 모든 좌석 정보 합치기
        const allSeats = [...availableSeats, ...occupiedSeats];

        // 좌석 행(row) 정보 추출
        const rows = [...new Set(allSeats.map(seat => seat.rowName))].sort();

        return (
            <SeatGrid>
                <ScreenContainer>
                    <Screen>SCREEN</Screen>
                </ScreenContainer>

                <RowsContainer>
                    {rows.map(rowName => {
                        // 현재 행의 좌석들
                        const rowSeats = allSeats.filter(seat => seat.rowName === rowName);

                        // 좌석 번호로 정렬
                        rowSeats.sort((a, b) => a.seatNumber - b.seatNumber);

                        return (
                            <SeatRow key={rowName}>
                                <RowLabel>{rowName}</RowLabel>
                                {rowSeats.map(seat => (
                                    <Seat
                                        key={seat.id}
                                        status={getSeatStatus(seat)}
                                        onClick={() => handleSeatClick(seat)}
                                        disabled={
                                            getSeatStatus(seat) === SEAT_STATUS.OCCUPIED ||
                                            getSeatStatus(seat) === SEAT_STATUS.DISABLED
                                        }
                                    >
                                        {seat.seatNumber}
                                    </Seat>
                                ))}
                            </SeatRow>
                        );
                    })}
                </RowsContainer>
            </SeatGrid>
        );
    };

    // 좌석 상태 안내
    const renderSeatGuide = () => {
        return (
            <SeatGuide>
                <GuideItem>
                    <GuideSeat status={SEAT_STATUS.AVAILABLE} />
                    <GuideText>선택 가능</GuideText>
                </GuideItem>
                <GuideItem>
                    <GuideSeat status={SEAT_STATUS.SELECTED} />
                    <GuideText>선택한 좌석</GuideText>
                </GuideItem>
                <GuideItem>
                    <GuideSeat status={SEAT_STATUS.OCCUPIED} />
                    <GuideText>예매 완료</GuideText>
                </GuideItem>
                <GuideItem>
                    <GuideSeat status={SEAT_STATUS.DISABLED} />
                    <GuideText>선택 불가</GuideText>
                </GuideItem>
            </SeatGuide>
        );
    };

    if (loading) {
        return <LoadingMessage>좌석 정보를 불러오는 중입니다...</LoadingMessage>;
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <SelectorContainer>
            {renderSeatGuide()}
            {generateSeatLayout()}
            <SelectedSeatInfo>
                <SelectedLabel>선택한 좌석:</SelectedLabel>
                {selectedSeats.length > 0 ? (
                    <SelectedSeats>
                        {selectedSeats.map(seat => `${seat.rowName}${seat.seatNumber}`).join(', ')}
                    </SelectedSeats>
                ) : (
                    <NoSelectedSeats>선택된 좌석이 없습니다</NoSelectedSeats>
                )}
            </SelectedSeatInfo>
        </SelectorContainer>
    );
};

// 스타일 컴포넌트
const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const SeatGrid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  margin: var(--spacing-lg) 0;
`;

const ScreenContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
`;

const Screen = styled.div`
  width: 80%;
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  text-align: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transform: perspective(500px) rotateX(-5deg);
`;

const RowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  overflow-x: auto;
`;

const SeatRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const RowLabel = styled.div`
  width: 30px;
  text-align: center;
  font-weight: 600;
  color: var(--color-text-secondary);
`;

const Seat = styled.button`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-sm);
  border: none;
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: var(--transition-fast);
  
  /* 좌석 상태별 스타일 */
  ${({ status }) => {
        switch (status) {
            case SEAT_STATUS.SELECTED:
                return `
          background-color: var(--color-primary);
          color: white;
          &:hover {
            background-color: var(--color-primary-dark, #d01830);
          }
        `;
            case SEAT_STATUS.OCCUPIED:
                return `
          background-color: var(--color-text-disabled);
          color: white;
          cursor: not-allowed;
        `;
            case SEAT_STATUS.DISABLED:
                return `
          background-color: var(--color-border);
          color: var(--color-text-disabled);
          cursor: not-allowed;
        `;
            case SEAT_STATUS.AVAILABLE:
            default:
                return `
          background-color: var(--color-surface);
          color: var(--color-text-primary);
          &:hover {
            background-color: var(--color-surface-variant, rgba(229, 25, 55, 0.1));
          }
        `;
        }
    }}
`;

const SeatGuide = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
`;

const GuideItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const GuideSeat = styled.div`
  width: 20px;
  height: 20px;
  border-radius: var(--border-radius-sm);
  
  /* 좌석 상태별 스타일 */
  ${({ status }) => {
        switch (status) {
            case SEAT_STATUS.SELECTED:
                return `background-color: var(--color-primary);`;
            case SEAT_STATUS.OCCUPIED:
                return `background-color: var(--color-text-disabled);`;
            case SEAT_STATUS.DISABLED:
                return `background-color: var(--color-border);`;
            case SEAT_STATUS.AVAILABLE:
            default:
                return `background-color: var(--color-surface); border: 1px solid var(--color-border);`;
        }
    }}
`;

const GuideText = styled.span`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const SelectedSeatInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
`;

const SelectedLabel = styled.span`
  font-weight: 600;
  color: var(--color-text-primary);
`;

const SelectedSeats = styled.span`
  color: var(--color-primary);
  font-weight: 500;
`;

const NoSelectedSeats = styled.span`
  color: var(--color-text-secondary);
  font-style: italic;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-error);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-error);
`;

const NoSeatsMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
`;

SeatSelector.propTypes = {
    screeningId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    selectedSeats: PropTypes.array,
    onSeatSelect: PropTypes.func.isRequired,
    maxSeats: PropTypes.number
};

export default SeatSelector;