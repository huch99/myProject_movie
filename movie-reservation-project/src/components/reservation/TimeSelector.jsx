// src/components/reservation/TimeSelector.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectScreening } from '../../store/slices/reservationSlice';
import { FaRegClock } from 'react-icons/fa';
import dateUtils from '../../utils/dateUtils';
import ROUTE_PATHS from '../../constants/routePaths';

/**
 * 영화 예매를 위한 상영 시간 선택 컴포넌트
 * 
 * @param {Object} props
 * @param {number} props.movieId - 영화 ID
 * @param {Array} props.availableDates - 예매 가능 날짜 배열
 * @param {Date} props.selectedDate - 선택된 날짜
 * @param {Object} props.selectedTheater - 선택된 극장 정보
 * @param {Function} props.onDateSelect - 날짜 선택 시 호출할 함수
 * @param {Function} props.onTheaterSelect - 극장 선택 시 호출할 함수
 * @param {Function} props.onScreeningSelect - 상영 정보 선택 시 호출할 함수
 */
const TimeSelector = ({
    movieId,
    availableDates = [],
    selectedDate = new Date(),
    selectedTheater = null,
    onDateSelect,
    onTheaterSelect,
    onScreeningSelect
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [theaters, setTheaters] = useState([]);
    const [screenings, setScreenings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');

    // 날짜가 없는 경우 오늘부터 7일간의 날짜 생성
    useEffect(() => {
        if (availableDates.length === 0) {
            const dates = dateUtils.getWeekDates();
            if (onDateSelect) {
                onDateSelect(dates[0].date);
            }
        }
    }, [availableDates, onDateSelect]);

    // 극장 목록 가져오기
    useEffect(() => {
        const fetchTheaters = async () => {
            try {
                setLoading(true);
                setError(null);

                // API 호출 - 실제 구현 시 axios 등으로 대체
                const response = await fetch(`/api/theaters?movieId=${movieId}`);

                if (!response.ok) {
                    throw new Error('극장 정보를 불러오는데 실패했습니다.');
                }

                const data = await response.json();
                setTheaters(data);

                // 지역 목록 추출
                const uniqueRegions = [...new Set(data.map(theater => theater.region))];
                setRegions(uniqueRegions);

                if (uniqueRegions.length > 0 && !selectedRegion) {
                    setSelectedRegion(uniqueRegions[0]);
                }

            } catch (err) {
                setError('극장 정보를 불러오는데 실패했습니다.');
                console.error('극장 정보 로딩 오류:', err);
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchTheaters();
        }
    }, [movieId, selectedRegion]);

    // 상영 정보 가져오기
    useEffect(() => {
        const fetchScreenings = async () => {
            if (!selectedTheater || !selectedDate) return;

            try {
                setLoading(true);
                setError(null);

                const formattedDate = dateUtils.formatDate(selectedDate);

                // API 호출 - 실제 구현 시 axios 등으로 대체
                const response = await fetch(`/api/screenings?theaterId=${selectedTheater.id}&movieId=${movieId}&date=${formattedDate}`);

                if (!response.ok) {
                    throw new Error('상영 정보를 불러오는데 실패했습니다.');
                }

                const data = await response.json();
                setScreenings(data);

            } catch (err) {
                setError('상영 정보를 불러오는데 실패했습니다.');
                console.error('상영 정보 로딩 오류:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchScreenings();
    }, [movieId, selectedTheater, selectedDate]);

    // 지역 선택 핸들러
    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
    };

    // 극장 선택 핸들러
    const handleTheaterSelect = (theater) => {
        if (onTheaterSelect) {
            onTheaterSelect(theater);
        }
    };

    // 상영 정보 선택 핸들러
    const handleScreeningSelect = (screening) => {
        dispatch(selectScreening(screening));

        if (onScreeningSelect) {
            onScreeningSelect(screening);
        } else {
            navigate(ROUTE_PATHS.RESERVATION(movieId));
        }
    };

    // 필터링된 극장 목록
    const filteredTheaters = selectedRegion
        ? theaters.filter(theater => theater.region === selectedRegion)
        : theaters;

    return (
        <TimeSelectorContainer>
            {/* 날짜 선택 섹션 */}
            <DateSection>
                <SectionTitle>날짜 선택</SectionTitle>
                <DateList>
                    {(availableDates.length > 0 ? availableDates : dateUtils.getWeekDates()).map((dateItem, index) => {
                        const date = dateItem.date || dateItem;
                        const isSelected = dateUtils.isSameDate(date, selectedDate);

                        return (
                            <DateItem
                                key={index}
                                selected={isSelected}
                                onClick={() => onDateSelect && onDateSelect(date)}
                            >
                                <DayName>{dateUtils.getShortDayOfWeek(date)}</DayName>
                                <DateNumber>{dateUtils.formatDate(date).substring(5).replace('-', '/')}</DateNumber>
                                {dateUtils.isToday(date) && <Today>오늘</Today>}
                            </DateItem>
                        );
                    })}
                </DateList>
            </DateSection>

            {/* 극장 선택 섹션 */}
            <TheaterSection>
                <SectionTitle>극장 선택</SectionTitle>

                {/* 지역 탭 */}
                <RegionTabs>
                    {regions.map(region => (
                        <RegionTab
                            key={region}
                            selected={region === selectedRegion}
                            onClick={() => handleRegionSelect(region)}
                        >
                            {region}
                        </RegionTab>
                    ))}
                </RegionTabs>

                {/* 극장 목록 */}
                <TheaterList>
                    {loading ? (
                        <LoadingMessage>극장 정보를 불러오는 중입니다...</LoadingMessage>
                    ) : error ? (
                        <ErrorMessage>{error}</ErrorMessage>
                    ) : filteredTheaters.length === 0 ? (
                        <NoTheaterMessage>해당 지역에 상영 중인 극장이 없습니다.</NoTheaterMessage>
                    ) : (
                        filteredTheaters.map(theater => (
                            <TheaterItem
                                key={theater.id}
                                selected={selectedTheater && selectedTheater.id === theater.id}
                                onClick={() => handleTheaterSelect(theater)}
                            >
                                {theater.name}
                            </TheaterItem>
                        ))
                    )}
                </TheaterList>
            </TheaterSection>

            {/* 상영 시간 선택 섹션 */}
            {selectedTheater && (
                <TimeSection>
                    <SectionTitle>상영 시간</SectionTitle>
                    {loading ? (
                        <LoadingMessage>상영 시간을 불러오는 중입니다...</LoadingMessage>
                    ) : error ? (
                        <ErrorMessage>{error}</ErrorMessage>
                    ) : screenings.length === 0 ? (
                        <NoScreeningMessage>선택한 날짜에 상영 일정이 없습니다.</NoScreeningMessage>
                    ) : (
                        <TimeList>
                            {screenings.map(screening => (
                                <TimeItem
                                    key={screening.id}
                                    onClick={() => handleScreeningSelect(screening)}
                                >
                                    <TimeInfo>
                                        <TimeIcon><FaRegClock /></TimeIcon>
                                        <Time>{screening.time}</Time>
                                    </TimeInfo>
                                    <ScreenInfo>
                                        <ScreenName>{screening.screen}</ScreenName>
                                        <ScreenType>{screening.type}</ScreenType>
                                    </ScreenInfo>
                                    <SeatInfo>{screening.seats}</SeatInfo>
                                </TimeItem>
                            ))}
                        </TimeList>
                    )}
                </TimeSection>
            )}
        </TimeSelectorContainer>
    );
};

// 스타일 컴포넌트
const TimeSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const DateSection = styled.div`
  margin-bottom: var(--spacing-md);
`;

const DateList = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: var(--border-radius-full);
  }
`;

const DateItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  background-color: ${({ selected }) =>
        selected ? 'var(--color-primary)' : 'var(--color-surface)'};
  color: ${({ selected }) =>
        selected ? 'white' : 'var(--color-text-primary)'};
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: ${({ selected }) =>
        selected ? 'var(--color-primary)' : 'var(--color-surface-variant, rgba(0, 0, 0, 0.03))'};
  }
`;

const DayName = styled.div`
  font-size: var(--font-size-xs);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const DateNumber = styled.div`
  font-size: var(--font-size-md);
  font-weight: 600;
`;

const Today = styled.div`
  font-size: var(--font-size-xs);
  background-color: var(--color-primary);
  color: white;
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  margin-top: var(--spacing-xs);
`;

const TheaterSection = styled.div`
  margin-bottom: var(--spacing-md);
`;

const RegionTabs = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  overflow-x: auto;
  padding-bottom: var(--spacing-xs);
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: var(--border-radius-full);
  }
`;

const RegionTab = styled.div`
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-full);
  background-color: ${({ selected }) =>
        selected ? 'var(--color-primary)' : 'var(--color-surface)'};
  color: ${({ selected }) =>
        selected ? 'white' : 'var(--color-text-primary)'};
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
  
  &:hover {
    background-color: ${({ selected }) =>
        selected ? 'var(--color-primary)' : 'var(--color-surface-variant, rgba(0, 0, 0, 0.03))'};
  }
`;

const TheaterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: var(--border-radius-full);
  }
`;

const TheaterItem = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: ${({ selected }) =>
        selected ? 'var(--color-primary)' : 'var(--color-surface)'};
  color: ${({ selected }) =>
        selected ? 'white' : 'var(--color-text-primary)'};
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: ${({ selected }) =>
        selected ? 'var(--color-primary)' : 'var(--color-surface-variant, rgba(0, 0, 0, 0.03))'};
  }
`;

const TimeSection = styled.div``;

const TimeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
`;

const TimeItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
    transform: translateY(-2px);
  }
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
`;

const TimeIcon = styled.span`
  color: var(--color-primary);
`;

const Time = styled.span`
  font-size: var(--font-size-lg);
  font-weight: 600;
`;

const ScreenInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
`;

const ScreenName = styled.span`
  font-size: var(--font-size-sm);
`;

const ScreenType = styled.span`
  font-size: var(--font-size-xs);
  background-color: var(--color-primary);
  color: white;
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
`;

const SeatInfo = styled.span`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-error);
`;

const NoTheaterMessage = styled.div`
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-secondary);
`;

const NoScreeningMessage = styled.div`
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-secondary);
`;

TimeSelector.propTypes = {
    movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    availableDates: PropTypes.array,
    selectedDate: PropTypes.instanceOf(Date),
    selectedTheater: PropTypes.object,
    onDateSelect: PropTypes.func,
    onTheaterSelect: PropTypes.func,
    onScreeningSelect: PropTypes.func
};

export default TimeSelector;