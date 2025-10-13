// src/components/schedule/ScheduleInfo.jsx
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaFilm } from 'react-icons/fa';
import dateUtils from '../../utils/dateUtils';
import ROUTE_PATHS from '../../constants/routePaths';
import { Link } from 'react-router-dom';

/**
 * 상영 일정 정보 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.schedule - 상영 일정 정보 객체
 * @param {boolean} props.showActions - 액션 버튼 표시 여부
 */
const ScheduleInfo = ({ schedule, showActions = true }) => {
    if (!schedule) return null;

    // 상영 가능 여부 확인 (현재 시간 기준)
    const isAvailable = () => {
        const now = new Date();
        const scheduleTime = new Date(schedule.screeningDateTime);
        return scheduleTime > now;
    };

    // 좌석 가용률 계산
    const calculateSeatAvailability = () => {
        const available = schedule.availableSeats || 0;
        const total = schedule.totalSeats || 0;

        if (total === 0) return '0%';

        const percentage = Math.round((available / total) * 100);
        return `${percentage}%`;
    };

    return (
        <ScheduleContainer available={isAvailable()}>
            <ScheduleHeader>
                <MovieTitle>
                    <FaFilm />
                    <span>{schedule.movie?.title || '영화 정보 없음'}</span>
                </MovieTitle>

                <ScreenInfo>
                    {schedule.screenType && (
                        <ScreenType>{schedule.screenType}</ScreenType>
                    )}
                    <ScreenName>{schedule.screenName}</ScreenName>
                </ScreenInfo>
            </ScheduleHeader>

            <ScheduleDetails>
                <DetailItem>
                    <DetailIcon>
                        <FaCalendarAlt />
                    </DetailIcon>
                    <DetailText>
                        {dateUtils.formatDate(schedule.screeningDateTime)}
                    </DetailText>
                </DetailItem>

                <DetailItem>
                    <DetailIcon>
                        <FaClock />
                    </DetailIcon>
                    <DetailText>
                        {dateUtils.formatTime(schedule.screeningDateTime)}
                        {schedule.endTime && ` ~ ${dateUtils.formatTime(schedule.endTime)}`}
                    </DetailText>
                </DetailItem>

                <DetailItem>
                    <DetailIcon>
                        <FaMapMarkerAlt />
                    </DetailIcon>
                    <DetailText>
                        {schedule.theater?.name || '극장 정보 없음'}
                    </DetailText>
                </DetailItem>
            </ScheduleDetails>

            <ScheduleStatus>
                <SeatInfo>
                    <SeatLabel>좌석</SeatLabel>
                    <SeatValue>
                        {schedule.availableSeats || 0}/{schedule.totalSeats || 0}
                    </SeatValue>
                    <SeatPercentage>({calculateSeatAvailability()} 가용)</SeatPercentage>
                </SeatInfo>

                {showActions && (
                    <ActionButton
                        to={ROUTE_PATHS.RESERVATION(schedule.movie?.id)}
                        state={{ scheduleId: schedule.id }}
                        disabled={!isAvailable()}
                    >
                        {isAvailable() ? '예매하기' : '예매 마감'}
                    </ActionButton>
                )}
            </ScheduleStatus>
        </ScheduleContainer>
    );
};

// 스타일 컴포넌트
const ScheduleContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--box-shadow-sm);
  opacity: ${props => props.available ? 1 : 0.7};
  transition: var(--transition-fast);
  
  &:hover {
    transform: ${props => props.available ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.available ? 'var(--box-shadow-md)' : 'var(--box-shadow-sm)'};
  }
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
`;

const MovieTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-md);
  font-weight: 600;
  margin: 0;
  
  svg {
    color: var(--color-primary);
  }
`;

const ScreenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const ScreenType = styled.span`
  background-color: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
`;

const ScreenName = styled.span`
  font-size: var(--font-size-sm);
  font-weight: 500;
`;

const ScheduleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const DetailIcon = styled.div`
  color: var(--color-primary);
  width: 16px;
  display: flex;
  justify-content: center;
`;

const DetailText = styled.div`
  font-size: var(--font-size-sm);
`;

const ScheduleStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SeatInfo = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
`;

const SeatLabel = styled.span`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const SeatValue = styled.span`
  font-weight: 600;
`;

const SeatPercentage = styled.span`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const ActionButton = styled(Link)`
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: ${props => props.disabled ? 'var(--color-text-disabled)' : 'var(--color-primary)'};
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  text-decoration: none;
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  
  &:hover {
    background-color: ${props => props.disabled ? 'var(--color-text-disabled)' : 'var(--color-primary-dark, #d01830)'};
  }
`;

ScheduleInfo.propTypes = {
    schedule: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        screeningDateTime: PropTypes.string.isRequired,
        endTime: PropTypes.string,
        screenName: PropTypes.string.isRequired,
        screenType: PropTypes.string,
        availableSeats: PropTypes.number,
        totalSeats: PropTypes.number,
        movie: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            title: PropTypes.string
        }),
        theater: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string
        })
    }).isRequired,
    showActions: PropTypes.bool
};

export default ScheduleInfo;