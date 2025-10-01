import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Movie } from '../types/movie.types';
import theaterService from '../service/theaterService';
import movieService from '../service/movieService';
import Spinner from '../components/common/Spinner';
import SectionTitle from '../components/common/SectionTitle';
import MovieSlider from '../components/home/MovieSlider';
import type { Theater, TheaterScreen } from '../types/theater.types';

const Container = styled.div`
  max-width: 1000px;
  margin: 50px auto;
  padding: 0 20px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: #666;
  text-decoration: none;
  
  &:hover {
    color: #e51937;
  }
`;

const TheaterHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TheaterImage = styled.img`
  width: 350px;
  height: 220px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const TheaterInfo = styled.div`
  flex: 1;
`;

const TheaterName = styled.h1`
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 15px;
`;

const TheaterDetail = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 10px;
  
  span {
    font-weight: 600;
    margin-right: 8px;
  }
`;

const TheaterFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 15px 0;
`;

const TheaterFeature = styled.span`
  display: inline-block;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border-radius: 20px;
  color: #333;
  font-size: 0.9rem;
`;

const Section = styled.section`
  margin: 40px 0;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
  background-color: #f5f5f5;
`;

const TabContainer = styled.div`
  margin-bottom: 30px;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ $isActive?: boolean }>`
  padding: 12px 20px;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.$isActive ? '#e51937' : 'transparent'};
  color: ${props => props.$isActive ? '#e51937' : '#666'};
  font-size: 1.1rem;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #e51937;
  }
`;

const ScreenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ScreenCard = styled.div`
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const ScreenName = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
`;

const ScreenDetail = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 5px;
`;

const DateSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const DateButton = styled.button<{ $isActive?: boolean }>`
  padding: 10px 15px;
  background-color: ${props => props.$isActive ? '#e51937' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#333'};
  border: 1px solid ${props => props.$isActive ? '#e51937' : '#ddd'};
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$isActive ? '#c41730' : '#f5f5f5'};
  }
`;

const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHead = styled.thead`
  background-color: #f5f5f5;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  color: #333;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 12px;
  color: #555;
`;

const BookButton = styled(Link)`
  display: inline-block;
  padding: 5px 10px;
  background-color: #e51937;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c41730;
  }
  
   &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const SoldOutTag = styled.span`
  display: inline-block;
  padding: 5px 10px;
  background-color: #999;
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const NoSchedules = styled.div`
  text-align: center;
  padding: 30px 0;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  color: #e51937;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 50px;
`;

interface ScheduleItem {
  id: number;
  movieId: number;
  movieTitle: string;
  screenName: string;
  startTime: string;
  endTime: string;
  availableSeats: number;
  totalSeats: number;
}

const TheaterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [theater, setTheater] = useState<Theater | null>(null);
  const [screens, setScreens] = useState<TheaterScreen[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'schedule'>('info');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // 날짜 목록 생성 (오늘부터 7일)
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  // 극장 정보 및 관련 데이터 가져오기
  useEffect(() => {
    const fetchTheaterData = async () => {
      if (!id) {
        setError("극장 ID가 제공되지 않았습니다.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. 극장 정보 가져오기
        const theaterData = await theaterService.getTheaterById(Number(id));
        setTheater(theaterData);

        // 2. 상영관 정보 가져오기
        const screenData = await theaterService.getScreens(Number(id));
        // @ts-ignore
        setScreens(screenData);

        // 3. 상영 중인 영화 목록 가져오기
        const nowPlayingMovies = await movieService.getNowPlayingMovies(1, 10);
        setMovies(nowPlayingMovies.movies);

        // 4. 선택한 날짜의 상영 일정 가져오기
        if (activeTab === 'schedule') {
          await fetchSchedules(Number(id), selectedDate);
        }
      } catch (err) {
        console.error(`극장 (ID: ${id}) 정보를 불러오는데 실패했습니다:`, err);
        setError("극장 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterData();
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤
  }, [id]);

  // 상영 일정 가져오기
  const fetchSchedules = async (theaterId: number, date: string) => {
    try {
      const scheduleData = await theaterService.getTheaterSchedule(theaterId, date);
      setSchedules(scheduleData.schedules || []);
    } catch (err) {
      console.error('상영 일정을 불러오는데 실패했습니다:', err);
      setError("상영 일정을 불러오는데 실패했습니다.");
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: 'info' | 'schedule') => {
    setActiveTab(tab);

    if (tab === 'schedule' && theater) {
      fetchSchedules(theater.id, selectedDate);
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (date: string) => {
    setSelectedDate(date);

    if (theater) {
      fetchSchedules(theater.id, date);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];

    return `${month}/${day} (${dayOfWeek})`;
  };

  // 시간 포맷 함수
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  if (loading) return <Container><Spinner /></Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;
  if (!theater) return <Container><ErrorMessage>해당 극장을 찾을 수 없습니다.</ErrorMessage></Container>;


  return (
    <Container>
      <BackLink to="/theaters">← 극장 목록으로 돌아가기</BackLink>

      <TheaterHeader>
        <TheaterImage src={theater.imageUrl || 'https://via.placeholder.com/350x220?text=극장+이미지'} alt={theater.name} />
        <TheaterInfo>
          <TheaterName>{theater.name}</TheaterName>
          <TheaterDetail><span>주소:</span> {theater.address}</TheaterDetail>
          <TheaterDetail><span>전화:</span> {theater.phone || '정보 없음'}</TheaterDetail>
          <TheaterDetail><span>주차:</span> {theater.parking || '정보 없음'}</TheaterDetail>

          {theater.features && theater.features.length > 0 && (
            <TheaterFeatures>
              {theater.features.map((feature, index) => (
                <TheaterFeature key={index}>{feature}</TheaterFeature>
              ))}
            </TheaterFeatures>
          )}
        </TheaterInfo>
      </TheaterHeader>

      <TabContainer>
        <TabButtons>
          <TabButton $isActive={activeTab === 'info'} onClick={() => handleTabChange('info')}>
            극장 정보
          </TabButton>
          <TabButton $isActive={activeTab === 'schedule'} onClick={() => handleTabChange('schedule')}>
            상영 시간표
          </TabButton>
        </TabButtons>

        {/* 극장 정보 탭 */}
        {activeTab === 'info' && (
          <>
            <Section>
              <SectionTitle>위치 안내</SectionTitle>
              <MapContainer id="map">
                {/* 여기에 지도 API를 연동하여 극장 위치를 표시할 수 있습니다 */}
                {/* 예: Kakao Map, Naver Map, Google Map 등 */}
              </MapContainer>
              <TheaterDetail><span>주소:</span> {theater.address}</TheaterDetail>
              <TheaterDetail><span>교통안내:</span> {theater.transportation || '정보 없음'}</TheaterDetail>
            </Section>

            <Section>
              <SectionTitle>상영관 정보</SectionTitle>
              <ScreenGrid>
                {screens.map((screen) => (
                  <ScreenCard key={screen.id}>
                    <ScreenName>{screen.name}</ScreenName>
                    <ScreenDetail><span>좌석:</span> {screen.capacity}석</ScreenDetail>
                    <ScreenDetail><span>유형:</span> {screen.type || '일반'}</ScreenDetail>
                  </ScreenCard>
                ))}
              </ScreenGrid>
            </Section>

            <Section>
              <SectionTitle>현재 상영작</SectionTitle>
              <MovieSlider movies={movies} />
            </Section>
          </>
        )}

        {/* 상영 시간표 탭 */}
        {activeTab === 'schedule' && (
          <>
            <DateSelector>
              {dates.map((date) => (
                <DateButton
                  key={date}
                  $isActive={date === selectedDate}
                  onClick={() => handleDateChange(date)}
                >
                  {formatDate(date)}
                </DateButton>
              ))}
            </DateSelector>

            {schedules.length === 0 ? (
              <NoSchedules>선택한 날짜에 상영 일정이 없습니다.</NoSchedules>
            ) : (
              <ScheduleTable>
                <TableHead>
                  <TableRow>
                    <TableHeader>영화</TableHeader>
                    <TableHeader>상영관</TableHeader>
                    <TableHeader>시작 시간</TableHeader>
                    <TableHeader>종료 시간</TableHeader>
                    <TableHeader>잔여 좌석</TableHeader>
                    <TableHeader>예매</TableHeader>
                  </TableRow>
                </TableHead>
                <tbody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.movieTitle}</TableCell>
                      <TableCell>{schedule.screenName}</TableCell>
                      <TableCell>{formatTime(schedule.startTime)}</TableCell>
                      <TableCell>{formatTime(schedule.endTime)}</TableCell>
                      <TableCell>
                        {schedule.availableSeats} / {schedule.totalSeats}
                      </TableCell>
                      <TableCell>
                        {schedule.availableSeats > 0 ? (
                          <BookButton to={`/booking?screeningId=${schedule.id}`}>
                            예매
                          </BookButton>
                        ) : (
                          <SoldOutTag>매진</SoldOutTag>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </ScheduleTable>
            )}
          </>
        )}
      </TabContainer>
    </Container>
  );
};

export default TheaterDetailPage;