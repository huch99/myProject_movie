// 영화 상세 페이지
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchMovieDetails } from '../store/slices/movieSlice';
import { selectScreening, selectDate } from '../store/slices/reservationSlice';
import MovieInfo from '../components/movie/MovieInfo';
// import MovieRating from '../components/movie/MovieRating';
// import MovieSchedule from '../components/movie/MovieSchedule';
// import ReviewSection from '../components/movie/ReviewSection';
// import RelatedMovies from '../components/movie/RelatedMovies';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import useScrollToTop from '../hooks/useScrollToTop';
import dateUtils from '../utils/dateUtils';

const MovieDetailPage = () => {
    // 스크롤을 맨 위로 이동
    useScrollToTop();

    const { movieId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentMovie, loading, error } = useSelector((state) => state.movies);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);

    // 페이지 로드 시 영화 상세 정보 가져오기
    useEffect(() => {
        if (movieId) {
            console.log(currentMovie);
            dispatch(fetchMovieDetails(movieId));
        }
    }, [dispatch, movieId]);

    // 상영 가능한 날짜 설정 (오늘부터 7일)
    useEffect(() => {
        const dates = dateUtils.getWeekDates();
        setAvailableDates(dates);
    }, []);

    // 예매 버튼 클릭 핸들러
    const handleReservationClick = (screening) => {
        if (!screening) return;

        dispatch(selectScreening(screening));
        dispatch(selectDate(selectedDate));
        navigate(`/reservation/${id}`);
    };

    // 날짜 선택 핸들러
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    // 극장 선택 핸들러
    const handleTheaterSelect = (theater) => {
        setSelectedTheater(theater);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <ErrorContainer>
                <h2>영화 정보를 불러오는데 실패했습니다.</h2>
                <p>{error}</p>
                <Button onClick={() => navigate(-1)}>이전 페이지로 돌아가기</Button>
            </ErrorContainer>
        );
    }

    if (!currentMovie) {
        return (
            <ErrorContainer>
                <h2>영화 정보를 찾을 수 없습니다.</h2>
                <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
            </ErrorContainer>
        );
    }

    return (
        <DetailPageContainer>
            {/* 영화 상세 정보 상단 섹션 */}
            <HeroSection backgroundImage={currentMovie.data.backgroundUrl}>
                <Overlay />
                <HeroContent>
                    <PosterContainer>
                        <MoviePoster src={currentMovie.data.posterUrl} alt={currentMovie.data.title} />
                        {currentMovie.isScreening && (
                            <ReservationButton onClick={() => handleReservationClick()}>
                                예매하기
                            </ReservationButton>
                        )}
                    </PosterContainer>

                    <MovieInfoContainer>
                        <MovieTitle>{currentMovie.data.title}</MovieTitle>
                        <MovieOriginalTitle>{currentMovie.data.titleEn}</MovieOriginalTitle>

                        <MovieMetaInfo>
                            <span>{currentMovie.data.releaseDate} 개봉</span>
                            <Divider>|</Divider>
                            <span>{currentMovie.data.runningTime}분</span>
                            <Divider>|</Divider>
                            <span>{currentMovie.data.rating}</span>
                        </MovieMetaInfo>

                        <GenreList>
                            {currentMovie.data.genres?.map((genre) => (
                                <GenreTag key={genre.id}>{genre.name}</GenreTag>
                            ))}
                        </GenreList>

                        {/* <MovieRating
                            averageRating={currentMovie.averageRating}
                            totalRatings={currentMovie.totalRatings}
                        /> */}
                    </MovieInfoContainer>
                </HeroContent>
            </HeroSection>

            <ContentSection>
                {/* 영화 정보 탭 */}
                <TabsContainer>
                    <Tab>영화 정보</Tab>
                    <Tab>상영 시간표</Tab>
                    <Tab>관람평</Tab>
                </TabsContainer>

                {/* 영화 상세 정보 */}
                <Section>
                    <SectionTitle>영화 정보</SectionTitle>
                    <MovieInfo movie={currentMovie} />
                </Section>

                {/* 상영 시간표 */}
                <Section>
                    <SectionTitle>상영 시간표</SectionTitle>
                    {/* <MovieSchedule
                        movieId={currentMovie.id}
                        availableDates={availableDates}
                        selectedDate={selectedDate}
                        selectedTheater={selectedTheater}
                        onDateSelect={handleDateSelect}
                        onTheaterSelect={handleTheaterSelect}
                        onScreeningSelect={handleReservationClick}
                    /> */}
                </Section>

                {/* 관람평 섹션 */}
                <Section>
                    <SectionTitle>관람평</SectionTitle>
                    {/* <ReviewSection movieId={currentMovie.id} /> */}
                </Section>

                {/* 관련 영화 추천 */}
                <Section>
                    <SectionTitle>비슷한 영화</SectionTitle>
                    {/* <RelatedMovies genres={currentMovie.genres} currentMovieId={currentMovie.id} /> */}
                </Section>
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
  height: 500px;
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
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%);
  
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
    flex-direction: column;
    padding: var(--spacing-md);
  }
`;

const PosterContainer = styled.div`
  margin-right: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: var(--spacing-md);
  }
`;

const MoviePoster = styled.img`
  width: 240px;
  height: 360px;
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow-lg);
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 180px;
    height: 270px;
  }
`;

const ReservationButton = styled(Button)`
  margin-top: var(--spacing-md);
  width: 100%;
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
  padding: var(--spacing-sm) var(--spacing-md);
`;

const MovieInfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MovieTitle = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-2xl);
    color: var(--color-text-primary);
  }
`;

const MovieOriginalTitle = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: 400;
  margin-bottom: var(--spacing-md);
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-md);
    color: var(--color-text-secondary);
  }
`;

const MovieMetaInfo = styled.div`
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

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
`;

const GenreTag = styled.span`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  
  @media (max-width: 768px) {
    background-color: var(--color-primary);
    color: white;
  }
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
  font-weight: 500;
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
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover:after,
  &.active:after {
    transform: scaleX(1);
  }
  
  &.active {
    color: var(--color-primary);
    font-weight: 700;
  }
`;

const Section = styled.section`
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
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

export default MovieDetailPage;