// src/components/theater/TheaterCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt, FaPhone, FaFilm } from 'react-icons/fa';
import ROUTE_PATHS from '../../constants/routePaths';

/**
 * 극장 정보 카드 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.theater - 극장 정보 객체
 * @param {boolean} props.compact - 간소화된 카드 표시 여부
 */
const TheaterCard = ({ theater, compact = false }) => {
    if (!theater) return null;

    // 간소화된 카드 렌더링
    if (compact) {
        return (
            <CompactCardContainer to={ROUTE_PATHS.THEATER_DETAIL(theater.id)}>
                <CompactCardHeader>
                    <CompactTheaterName>{theater.name}</CompactTheaterName>
                    <RegionBadge>{theater.region}</RegionBadge>
                </CompactCardHeader>
                <CompactCardAddress>
                    <FaMapMarkerAlt />
                    <span>{theater.address}</span>
                </CompactCardAddress>
            </CompactCardContainer>
        );
    }

    // 기본 카드 렌더링
    return (
        <CardContainer to={ROUTE_PATHS.THEATER_DETAIL(theater.id)}>
            <CardHeader>
                <TheaterName>{theater.name}</TheaterName>
                <RegionBadge>{theater.region}</RegionBadge>
            </CardHeader>

            <CardContent>
                <InfoItem>
                    <InfoIcon>
                        <FaMapMarkerAlt />
                    </InfoIcon>
                    <InfoText>{theater.address}</InfoText>
                </InfoItem>

                {theater.phoneNumber && (
                    <InfoItem>
                        <InfoIcon>
                            <FaPhone />
                        </InfoIcon>
                        <InfoText>{theater.phoneNumber}</InfoText>
                    </InfoItem>
                )}

                {theater.totalScreens && (
                    <InfoItem>
                        <InfoIcon>
                            <FaFilm />
                        </InfoIcon>
                        <InfoText>{theater.totalScreens}개 상영관</InfoText>
                    </InfoItem>
                )}
            </CardContent>

            <CardFooter>
                <DetailsButton>상세보기</DetailsButton>
            </CardFooter>
        </CardContainer>
    );
};

// 스타일 컴포넌트
const CardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;
  transition: var(--transition-fast);
  text-decoration: none;
  color: var(--color-text-primary);
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--box-shadow-md);
  }
`;

const CardHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TheaterName = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
`;

const RegionBadge = styled.span`
  background-color: var(--color-primary);
  color: white;
  padding: 2px var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
`;

const CardContent = styled.div`
  padding: var(--spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
`;

const InfoIcon = styled.div`
  color: var(--color-primary);
  margin-top: 2px;
`;

const InfoText = styled.div`
  font-size: var(--font-size-sm);
  line-height: 1.4;
`;

const CardFooter = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
`;

const DetailsButton = styled.span`
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
`;

// 간소화된 카드 스타일
const CompactCardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  box-shadow: var(--box-shadow-sm);
  transition: var(--transition-fast);
  text-decoration: none;
  color: var(--color-text-primary);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const CompactCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
`;

const CompactTheaterName = styled.h4`
  font-size: var(--font-size-md);
  font-weight: 600;
  margin: 0;
`;

const CompactCardAddress = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  
  svg {
    color: var(--color-primary);
    font-size: 12px;
  }
`;

TheaterCard.propTypes = {
    theater: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        region: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string,
        totalScreens: PropTypes.number
    }).isRequired,
    compact: PropTypes.bool
};

export default TheaterCard;