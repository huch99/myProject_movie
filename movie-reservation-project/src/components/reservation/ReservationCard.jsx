// src/components/reservation/ReservationCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import dateUtils from '../../utils/dateUtils';
import ROUTE_PATHS from '../../constants/routePaths';

/**
 * 예매 정보 카드 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.reservation - 예매 정보 객체
 * @param {boolean} props.compact - 간소화된 카드 표시 여부
 * @param {Function} props.onViewDetail - 상세 보기 클릭 시 호출될 함수
 */
const ReservationCard = ({ reservation, compact = false, onViewDetail }) => {
    if (!reservation) return null;

    // 예매 상태에 따른 스타일 및 텍스트
    const getStatusInfo = (status) => {
        switch (status) {
            case 'COMPLETED':
                return { color: 'var(--color-success)', text: '예매 완료' };
            case 'CANCELED':
                return { color: 'var(--color-error)', text: '예매 취소' };
            case 'PENDING':
                return { color: 'var(--color-warning)', text: '결제 대기' };
            default:
                return { color: 'var(--color-text-secondary)', text: '상태 미정' };
        }
    };

    const statusInfo = getStatusInfo(reservation.status);

    // 간소화된 카드 렌더링
    if (compact) {
        return (
            <CompactCardContainer>
                <CompactCardHeader>
                    <CompactMovieTitle>{reservation.movie.title}</CompactMovieTitle>
                    <ReservationStatus color={statusInfo.color}>
                        {statusInfo.text}
                    </ReservationStatus>
                </CompactCardHeader>

                <CompactCardInfo>
                    <CompactInfoItem>
                        <FaCalendarAlt />
                        <span>{dateUtils.formatDate(reservation.screeningDateTime)}</span>
                    </CompactInfoItem>
                    <CompactInfoItem>
                        <FaClock />
                        <span>{dateUtils.formatTime(reservation.screeningDateTime)}</span>
                    </CompactInfoItem>
                    <CompactInfoItem>
                        <FaMapMarkerAlt />
                        <span>{reservation.theater.name}</span>
                    </CompactInfoItem>
                </CompactCardInfo>

                <CompactCardAction>
                    <DetailButton
                        onClick={onViewDetail ? () => onViewDetail(reservation) : null}
                        to={onViewDetail ? null : ROUTE_PATHS.RESERVATION_DETAIL(reservation.id)}
                    >
                        상세 보기
                    </DetailButton>
                </CompactCardAction>
            </CompactCardContainer>
        );
    }

    // 기본 카드 렌더링
    return (
        <CardContainer status={reservation.status}>
            <CardHeader>
                <MovieInfo>
                    <MoviePoster
                        src={reservation.movie.posterUrl || '/images/default-poster.jpg'}
                        alt={reservation.movie.title}
                    />
                    <MovieDetails>
                        <MovieTitle>{reservation.movie.title}</MovieTitle>
                        <ReservationCode>
                            <FaTicketAlt />
                            <span>예매번호: {reservation.reservationCode}</span>
                        </ReservationCode>
                    </MovieDetails>
                </MovieInfo>
                <ReservationStatus color={statusInfo.color}>
                    {statusInfo.text}
                </ReservationStatus>
            </CardHeader>

            <CardBody>
                <InfoGrid>
                    <InfoItem>
                        <InfoIcon>
                            <FaCalendarAlt />
                        </InfoIcon>
                        <InfoContent>
                            <InfoLabel>관람일</InfoLabel>
                            <InfoValue>{dateUtils.formatDate(reservation.screeningDateTime)}</InfoValue>
                        </InfoContent>
                    </InfoItem>

                    <InfoItem>
                        <InfoIcon>
                            <FaClock />
                        </InfoIcon>
                        <InfoContent>
                            <InfoLabel>상영 시간</InfoLabel>
                            <InfoValue>{dateUtils.formatTime(reservation.screeningDateTime)}</InfoValue>
                        </InfoContent>
                    </InfoItem>

                    <InfoItem>
                        <InfoIcon>
                            <FaMapMarkerAlt />
                        </InfoIcon>
                        <InfoContent>
                            <InfoLabel>극장/상영관</InfoLabel>
                            <InfoValue>{reservation.theater.name} / {reservation.screenName}</InfoValue>
                        </InfoContent>
                    </InfoItem>

                    <InfoItem>
                        <InfoIcon>
                            <span>🪑</span>
                        </InfoIcon>
                        <InfoContent>
                            <InfoLabel>좌석</InfoLabel>
                            <InfoValue>{reservation.seats.join(', ')}</InfoValue>
                        </InfoContent>
                    </InfoItem>
                </InfoGrid>
            </CardBody>

            <CardFooter>
                <PriceInfo>
                    <PriceLabel>결제 금액</PriceLabel>
                    <PriceValue>{reservation.totalAmount.toLocaleString()}원</PriceValue>
                </PriceInfo>

                <ActionButtons>
                    <DetailButton
                        onClick={onViewDetail ? () => onViewDetail(reservation) : null}
                        to={onViewDetail ? null : ROUTE_PATHS.RESERVATION_DETAIL(reservation.id)}
                    >
                        상세 보기
                    </DetailButton>
                </ActionButtons>
            </CardFooter>
        </CardContainer>
    );
};

// 스타일 컴포넌트
const CardContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;
  border-left: 4px solid ${props => {
        switch (props.status) {
            case 'COMPLETED': return 'var(--color-success)';
            case 'CANCELED': return 'var(--color-error)';
            case 'PENDING': return 'var(--color-warning)';
            default: return 'var(--color-border)';
        }
    }};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
`;

const MovieInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const MoviePoster = styled.img`
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
`;

const MovieDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const MovieTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
`;

const ReservationCode = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const ReservationStatus = styled.div`
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: white;
  background-color: ${props => props.color || 'var(--color-text-secondary)'};
`;

const CardBody = styled.div`
  padding: var(--spacing-md);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
`;

const InfoIcon = styled.div`
  color: var(--color-primary);
  font-size: var(--font-size-md);
  width: 24px;
  display: flex;
  justify-content: center;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: 2px;
`;

const InfoValue = styled.div`
  font-size: var(--font-size-sm);
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
`;

const PriceLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const PriceValue = styled.div`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const DetailButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
`;

// 간소화된 카드 스타일
const CompactCardContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow-sm);
  padding: var(--spacing-sm);
`;

const CompactCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
`;

const CompactMovieTitle = styled.h4`
  font-size: var(--font-size-md);
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CompactCardInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs) var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-xs);
`;

const CompactInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
`;

const CompactCardAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

ReservationCard.propTypes = {
    reservation: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        reservationCode: PropTypes.string,
        status: PropTypes.string,
        screeningDateTime: PropTypes.string,
        screenName: PropTypes.string,
        seats: PropTypes.array,
        totalAmount: PropTypes.number,
        movie: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            title: PropTypes.string,
            posterUrl: PropTypes.string
        }),
        theater: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string
        })
    }).isRequired,
    compact: PropTypes.bool,
    onViewDetail: PropTypes.func
};

export default ReservationCard;