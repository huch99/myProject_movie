// 극장 상세 페이지
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    fetchTheaterDetails,
    fetchTheaterScreens,
    fetchTheaterSchedules,
    addFavoriteTheater,
    removeFavoriteTheater
} from '../store/slices/theaterSlice';
import TheaterInfo from '../components/theater/TheaterInfo';
import TheaterSchedule from '../components/theater/TheaterSchedule';
import TheaterMap from '../components/theater/TheaterMap';
import TheaterFacilities from '../components/theater/TheaterFacilities';
import DateSelector from '../components/common/DateSelector';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import useScrollToTop from '../hooks/useScrollToTop';
import dateUtils from '../utils/dateUtils';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const TheaterDetailPage = () => {
    // 스크롤을 맨 위로 이동
    useScrollToTop();

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentTheater, screens, schedules, favoriteTheaters, loading, error } = useSelector((state) => state.theaters);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableDates, setAvailableDates] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'info', 'map'

    // 페이지 로드 시 극장 상세 정보 가져오기
    useEffect(() => {
        if (id) {
            dispatch(fetchTheaterDetails(id));
            dispatch(fetchTheaterScreens(id));
        }
    }, [dispatch, id]);

    // 날짜 변경 시 상영 일정 가져오기
    useEffect(() => {
        if (id && selectedDate) {
            const formattedDate = dateUtils.formatDate(selectedDate);
            dispatch(fetchTheaterSchedules({ theaterId: id, date: formattedDate }));
        }
    }, [dispatch, id, selectedDate]);

    // 상영 가능한 날짜 설정 (오늘부터 7일)
    useEffect(() => {
        const dates = dateUtils.getWeekDates();
        setAvailableDates(dates);
    }, []);

    // 즐겨찾기 상태 확인
    useEffect(() => {
        if (currentTheater && favoriteTheaters) {
            const isTheaterFavorite = favoriteTheaters.some(theater => theater.id === parseInt(id));
            setIsFavorite(isTheaterFavorite);
        }
    }, [currentTheater, favoriteTheaters, id]);

    // 즐겨찾기 토글 핸들러
    const handleFavoriteToggle = () => {
        if (!currentTheater) return;

        if (isFavorite) {
            dispatch(removeFavoriteTheater(parseInt(id)));
        } else {
            dispatch(addFavoriteTheater(currentTheater));
        }
    };

    // 날짜 선택 핸들러
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    // 탭 선택 핸들러
    const handleTabSelect = (tab) => {
        setActiveTab(tab);
    };

    if (loading && !currentTheater) {
        return <Loading />;
    }

    if (error) {
        return (
            <ErrorContainer>
                <h2>극장 정보를 불러오는데 실패했습니다.</h2>
                <p>{error}</p>
                <Button onClick={() => navigate(-1)}>이전 페이지로 돌아가기</Button>
            </ErrorContainer>
        );
    }

    if (!currentTheater) {
        return (
            <ErrorContainer>
                <h2>극장 정보를 찾을 수 없습니다.</h2>
                <Button onClick={() => navigate('/theaters')}>극장 목록으로 돌아가기</Button>
            </ErrorContainer>
        );
    }

    return (
        <DetailPageContainer>
            {/* 극장 상세 정보 상단 섹션 */}
            <HeroSection backgroundImage={currentTheater.imageUrl}>
                <Overlay />
                <HeroContent>
                    <TheaterInfoContainer>
                        <TheaterTitle>{currentTheater.name}</TheaterTitle>
                        <TheaterAddress>{currentTheater.address}</TheaterAddress>

                        <TheaterMetaInfo>
                            <span>{currentTheater.phoneNumber}</span>
                            <Divider>|</Divider>
                            <span>{currentTheater.totalScreens}개 상영관</span>
                            <Divider>|</Divider>
                            <span>{currentTheater.totalSeats}석</span>
                        </TheaterMetaInfo>

                        <ActionButtons>
                            <FavoriteButton onClick={handleFavoriteToggle} isFavorite={isFavorite}>
                                {isFavorite ? <FaHeart /> : <FaRegHeart />}
                                <span>{isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}</span>
                            </FavoriteButton>

                            <ReservationButton onClick={() => setActiveTab('schedule')}>
                                예매하기
                            </ReservationButton>
                        </ActionButtons>
                    </TheaterInfoContainer>
                </HeroContent>
            </HeroSection>

            <ContentSection>
                {/* 탭 네비게이션 */}
                <TabsContainer>
                    <Tab
                        active={activeTab === 'schedule'}
                        onClick={() => handleTabSelect('schedule')}
                    >
                        상영시간표
                    </Tab>
                    <Tab
                        active={activeTab === 'info'}
                        onClick={() => handleTabSelect('info')}
                    >
                        극장정보
                    </Tab>
                    <Tab
                        active={activeTab === 'map'}
                        onClick={() => handleTabSelect('map')}
                    >
                        위치/교통
                    </Tab>
                </TabsContainer>

                {/* 상영 시간표 */}
                {activeTab === 'schedule' && (
                    <TabContent>
                        <DateSelectorWrapper>
                            <DateSelector
                                dates={availableDates}
                                selectedDate={selectedDate}
                                onSelectDate={handleDateSelect}
                            />
                        </DateSelectorWrapper>

                        <TheaterSchedule
                            schedules={schedules}
                            screens={screens}
                            loading={loading}
                        />
                    </TabContent>
                )}

                {/* 극장 정보 */}
                {activeTab === 'info' && (
                    <TabContent>
                        <TheaterInfo theater={currentTheater} />
                        <TheaterFacilities facilities={currentTheater.facilities} />
                    </TabContent>
                )}

                {/* 위치/교통 */}
                {activeTab === 'map' && (
                    <TabContent>
                        <TheaterLocation>
                            <h3>극장 위치</h3>
                            <TheaterAddressInfo>
                                <p><strong>주소:</strong> {currentTheater.address}</p>
                                <p><strong>전화번호:</strong> {currentTheater.phoneNumber}</p>
                            </TheaterAddressInfo>

                            <MapContainer>
                                <TheaterMap theater={currentTheater} />
                            </MapContainer>

                            {currentTheater.transportationInfo && (
                                <TransportationInfo>
                                    <h4>교통 안내</h4>
                                    <div dangerouslySetInnerHTML={{ __html: currentTheater.transportationInfo }} />
                                </TransportationInfo>
                            )}

                            {currentTheater.parkingInfo && (
                                <ParkingInfo>
                                    <h4>주차 안내</h4>
                                    <div dangerouslySetInnerHTML={{ __html: currentTheater.parkingInfo }} />
                                </ParkingInfo>
                            )}
                        </TheaterLocation>
                    </TabContent>
                )}
            </ContentSection>
        </DetailPageContainer>
    );
};

// 스타일 컴포넌트
const DetailPageContainer = styled.div`
  width: 100%;
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background-image: ${({ backgroundImage }) => backgroundImage ? `url(${backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  color: white;
  
  @media (max-width: 768px) {
    height: auto;
    background-image: none;
    background-color: var(--color-surface);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const TheaterInfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TheaterTitle = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-2xl);
    color: var(--color-text-primary);
  }
`;

const TheaterAddress = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: 400;
  margin-bottom: var(--spacing-md);
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-md);
    color: var(--color-text-secondary);
  }
`;

const TheaterMetaInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-md);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
`;

const Divider = styled.span`
  margin: 0 var(--spacing-sm);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
`;

const FavoriteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: ${({ isFavorite }) => isFavorite ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: ${({ isFavorite }) => isFavorite ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.3)'};
  }
  
  @media (max-width: 768px) {
    background-color: ${({ isFavorite }) => isFavorite ? 'var(--color-primary)' : 'var(--color-surface)'};
    color: ${({ isFavorite }) => isFavorite ? 'white' : 'var(--color-text-primary)'};
    border: 1px solid ${({ isFavorite }) => isFavorite ? 'var(--color-primary)' : 'var(--color-border)'};
  }
`;

const ReservationButton = styled(Button)`
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
  padding: var(--spacing-sm) var(--spacing-md);
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
`;

const Tab = styled.div`
  padding: var(--spacing-sm) var(--spacing-lg);
  font-weight: ${({ active }) => active ? '700' : '500'};
  color: ${({ active }) => active ? 'var(--color-primary)' : 'var(--color-text-primary)'};
  cursor: pointer;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--color-primary);
    transform: scaleX(${({ active }) => active ? '1' : '0'});
    transition: transform 0.3s ease;
  }
  
  &:hover:after {
    transform: scaleX(1);
  }
`;

const TabContent = styled.div`
  margin-top: var(--spacing-lg);
`;

const DateSelectorWrapper = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const TheaterLocation = styled.div`
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
  }
  
  h4 {
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin: var(--spacing-lg) 0 var(--spacing-sm);
    }
`;

const TheaterAddressInfo = styled.div`
    margin-bottom: var(--spacing-md);
    
    p {
        margin-bottom: var(--spacing-xs);
    }
`;

const MapContainer = styled.div`
    height: 400px;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: var(--box-shadow-md);
    margin: var(--spacing-lg) 0;
`;

const TransportationInfo = styled.div`
    margin-bottom: var(--spacing-lg);
    
    p {
        margin-bottom: var(--spacing-xs);
    }
`;

const ParkingInfo = styled.div`
    margin-bottom: var(--spacing-lg);
    
    p {
        margin-bottom: var(--spacing-xs);
    }
`;

const ErrorContainer = styled.div`
    max-width: 600px;
    margin: 100px auto;
    text-align: center;
    padding: var(--spacing-lg);
    background-color: var(--color-surface);
    border-radius: var(--border-radius-md);
    box-shadow: var(--box-shadow-md);
    
    h2 {
        margin-bottom: var(--spacing-md);
    }
    
    p {
        margin-bottom: var(--spacing-lg);
        color: var(--color-error);
    }
`;

export default TheaterDetailPage;