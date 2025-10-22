// 홈페이지
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import { fetchNowPlayingMovies, fetchComingSoonMovies, fetchPopularMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/movie/MovieCard';
import MainBanner from './home/MainBanner';
import MovieSlider from './home/MovieSlider';
// import EventSection from './home/EventSection';
// import QuickReservation from './home/QuickReservation';
import Loading from '../components/common/Loading';
import useScrollToTop from '../hooks/useScrollToTop';

const HomePage = () => {
  // 스크롤을 맨 위로 이동
  useScrollToTop();
  
  const dispatch = useDispatch();
  const { nowPlaying, comingSoon, popular, loading } = useSelector((state) => state.movies);
  
  // useEffect(() => {
  //   // 페이지 로드 시 영화 데이터 가져오기
  //   dispatch(fetchNowPlayingMovies());
  //   dispatch(fetchComingSoonMovies());
  //   dispatch(fetchPopularMovies());
  // }, [dispatch]);
  
  if (loading && !nowPlaying.length && !comingSoon.length && !popular.length) {
    return <Loading />;
  }
  
  return (
    <HomeContainer>
      {/* 메인 배너 (인기 영화 중 하나를 큰 배너로 표시) */}
      {/* <MainBanner movies={popular.slice(0, 5)} /> */}
      
      {/* 빠른 예매 섹션 */}
      {/* <Section>
        <QuickReservation />
      </Section> */}
      
      {/* 현재 상영 영화 섹션 */}
      <Section>
        <SectionHeader>
          <SectionTitle>현재 상영작</SectionTitle>
          <ViewMoreLink to="/movies/now-playing">더 보기</ViewMoreLink>
        </SectionHeader>
        {/* <MovieSlider movies={nowPlaying.slice(0, 10)} /> */}
      </Section>
      
      {/* 개봉 예정 영화 섹션 */}
      <Section>
        <SectionHeader>
          <SectionTitle>개봉 예정작</SectionTitle>
          <ViewMoreLink to="/movies/coming-soon">더 보기</ViewMoreLink>
        </SectionHeader>
        {/* <MovieSlider movies={comingSoon.slice(0, 10)} /> */}
      </Section>
      
      {/* 인기 영화 섹션 */}
      <Section>
        <SectionHeader>
          <SectionTitle>인기 영화</SectionTitle>
          <ViewMoreLink to="/movies/popular">더 보기</ViewMoreLink>
        </SectionHeader>
        <PopularMoviesGrid>
          {/* {popular.slice(0, 8).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))} */}
        </PopularMoviesGrid>
      </Section>
      
      {/* 이벤트 및 프로모션 섹션 */}
      {/* <Section>
        <SectionHeader>
          <SectionTitle>이벤트 & 프로모션</SectionTitle>
          <ViewMoreLink to="/events">더 보기</ViewMoreLink>
        </SectionHeader>
        <EventSection />
      </Section> */}
    </HomeContainer>
  );
};

// 스타일 컴포넌트
const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-sm);
  }
`;

const Section = styled.section`
  margin: var(--spacing-xl) 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
`;

const ViewMoreLink = styled(Link)`
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: var(--transition-fast);
  
  &:hover {
    text-decoration: underline;
  }
`;

const PopularMoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export default HomePage;