import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt, FaPhone, FaParking, FaSubway, FaBus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * 극장 상세 정보를 표시하는 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.theater - 극장 정보 객체
 */
const TheaterDetail = ({ theater }) => {
    if (!theater) return null;

    return (
        <DetailContainer>
            <TheaterInfoSection>
                <SectionTitle>극장 정보</SectionTitle>
                <InfoGrid>
                    <InfoItem>
                        <InfoLabel>
                            <FaMapMarkerAlt />
                            <span>주소</span>
                        </InfoLabel>
                        <InfoValue>{theater.address || '정보 없음'}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>
                            <FaPhone />
                            <span>전화번호</span>
                        </InfoLabel>
                        <InfoValue>{theater.phoneNumber || '정보 없음'}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>
                            <span>상영관</span>
                        </InfoLabel>
                        <InfoValue>{theater.totalScreens ? `${theater.totalScreens}개 상영관` : '정보 없음'}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>
                            <span>좌석</span>
                        </InfoLabel>
                        <InfoValue>{theater.totalSeats ? `${theater.totalSeats}석` : '정보 없음'}</InfoValue>
                    </InfoItem>
                </InfoGrid>
            </TheaterInfoSection>

            {theater.facilities && theater.facilities.length > 0 && (
                <FacilitiesSection>
                    <SectionTitle>시설 정보</SectionTitle>
                    <FacilitiesList>
                        {theater.facilities.map((facility, index) => (
                            <FacilityItem key={index}>
                                <FacilityIcon>{getFacilityIcon(facility.type)}</FacilityIcon>
                                <FacilityName>{facility.name}</FacilityName>
                            </FacilityItem>
                        ))}
                    </FacilitiesList>
                </FacilitiesSection>
            )}

            {theater.transportationInfo && (
                <TransportSection>
                    <SectionTitle>교통 안내</SectionTitle>
                    <TransportationInfo>
                        <TransportIcon>
                            <FaSubway />
                        </TransportIcon>
                        <TransportContent>
                            <TransportTitle>지하철 이용 시</TransportTitle>
                            <TransportText dangerouslySetInnerHTML={{ __html: theater.transportationInfo.subway || '정보 없음' }} />
                        </TransportContent>
                    </TransportationInfo>

                    <TransportationInfo>
                        <TransportIcon>
                            <FaBus />
                        </TransportIcon>
                        <TransportContent>
                            <TransportTitle>버스 이용 시</TransportTitle>
                            <TransportText dangerouslySetInnerHTML={{ __html: theater.transportationInfo.bus || '정보 없음' }} />
                        </TransportContent>
                    </TransportationInfo>
                </TransportSection>
            )}

            {theater.parkingInfo && (
                <ParkingSection>
                    <SectionTitle>주차 안내</SectionTitle>
                    <ParkingInfo>
                        <TransportIcon>
                            <FaParking />
                        </TransportIcon>
                        <TransportContent>
                            <TransportText dangerouslySetInnerHTML={{ __html: theater.parkingInfo }} />
                        </TransportContent>
                    </ParkingInfo>
                </ParkingSection>
            )}

            {theater.notice && (
                <NoticeSection>
                    <SectionTitle>극장 공지사항</SectionTitle>
                    <NoticeList>
                        {theater.notice.map((item, index) => (
                            <NoticeItem key={index}>
                                <NoticeTitle>{item.title}</NoticeTitle>
                                <NoticeDate>{item.date}</NoticeDate>
                            </NoticeItem>
                        ))}
                    </NoticeList>
                    <MoreButton to={`/theaters/${theater.id}/notice`}>
                        공지사항 더보기
                    </MoreButton>
                </NoticeSection>
            )}
        </DetailContainer>
    );
};

// 시설 아이콘 반환 함수
const getFacilityIcon = (type) => {
    switch (type) {
        case 'parking':
            return <FaParking />;
        case 'restaurant':
            return <span>🍽️</span>;
        case 'lounge':
            return <span>🛋️</span>;
        case 'disabled':
            return <span>♿</span>;
        default:
            return <span>🏢</span>;
    }
};

// 스타일 컴포넌트
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const TheaterInfoSection = styled.section`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const InfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  
  svg {
    color: var(--color-primary);
  }
`;

const InfoValue = styled.div`
  color: var(--color-text-primary);
`;

const FacilitiesSection = styled.section`
  margin-bottom: var(--spacing-lg);
`;

const FacilitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const FacilityItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  min-width: 100px;
  text-align: center;
`;

const FacilityIcon = styled.div`
  font-size: var(--font-size-xl);
  color: var(--color-primary);
`;

const FacilityName = styled.div`
  font-size: var(--font-size-sm);
`;

const TransportSection = styled.section`
  margin-bottom: var(--spacing-lg);
`;

const TransportationInfo = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const TransportIcon = styled.div`
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  margin-top: var(--spacing-xs);
`;

const TransportContent = styled.div`
  flex: 1;
`;

const TransportTitle = styled.div`
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
`;

const TransportText = styled.div`
  color: var(--color-text-primary);
  line-height: 1.6;
`;

const ParkingSection = styled.section`
  margin-bottom: var(--spacing-lg);
`;

const ParkingInfo = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const NoticeSection = styled.section`
  margin-bottom: var(--spacing-lg);
`;

const NoticeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const NoticeItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
  
  &:hover {
    background-color: var(--color-surface);
  }
`;

const NoticeTitle = styled.div`
  font-weight: 500;
`;

const NoticeDate = styled.div`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const MoreButton = styled(Link)`
  display: inline-block;
  margin-top: var(--spacing-md);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

TheaterDetail.propTypes = {
    theater: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        address: PropTypes.string,
        phoneNumber: PropTypes.string,
        totalScreens: PropTypes.number,
        totalSeats: PropTypes.number,
        facilities: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.string,
                name: PropTypes.string
            })
        ),
        transportationInfo: PropTypes.shape({
            subway: PropTypes.string,
            bus: PropTypes.string
        }),
        parkingInfo: PropTypes.string,
        notice: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                date: PropTypes.string
            })
        )
    }).isRequired
};

export default TheaterDetail;