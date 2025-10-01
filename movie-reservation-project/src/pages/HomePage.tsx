// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MovieSlider from '../components/home/MovieSlider';
import type { Movie } from '../types/movie.types';
import movieService from '../service/movieService';
import eventService, { type AppEvent } from '../service/eventService';
import theaterService from '../service/theaterService';
import Spinner from '../components/common/Spinner';
import SectionTitle from '../components/common/SectionTitle';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const HeroSection = styled.div`
  position: relative;
  height: 500px;
  margin-bottom: 60px;
  border-radius: 10px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: #e51937;
  color: white;
  padding: 10px 25px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c41730;
  }
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const ViewAllLink = styled(Link)`
  display: block;
  text-align: right;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  margin-top: 10px;
  
  &:hover {
    color: #e51937;
  }
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const EventCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const EventInfo = styled.div`
  padding: 15px;
`;

const EventTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #333;
`;

const EventPeriod = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const TheaterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const TheaterCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f8f8;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const TheaterName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #333;
`;

const TheaterLocation = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #e51937;
  padding: 20px;
  text-align: center;
`;

const HomePage: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 현재 상영작 가져오기
        const nowPlayingResponse = await movieService.getNowPlayingMovies(1, 10);
        setNowPlayingMovies(nowPlayingResponse.movies);

        // 첫 번째 영화를 특집 영화로 설정
        if (nowPlayingResponse.movies.length > 0) {
          const movieDetail = await movieService.getMovieById(nowPlayingResponse.movies[0].id);
          setFeaturedMovie(movieDetail);
        }

        // 상영 예정작 가져오기
        const comingSoonResponse = await movieService.getComingSoonMovies(1, 10);
        setComingSoonMovies(comingSoonResponse.movies);

        // 이벤트 가져오기
        const eventsResponse = await eventService.getEvents({ limit: 3 });
        setEvents(eventsResponse.events);

        // 극장 목록 가져오기
        const locations = await theaterService.getLocations();
        const theaterPromises = locations.slice(0, 6).map(location =>
          theaterService.getTheatersByLocation(location).then(theaters => ({
            location,
            count: theaters.length
          }))
        );

        const theaterData = await Promise.all(theaterPromises);
        setTheaters(theaterData);

      } catch (err) {
        console.error("홈페이지 데이터를 불러오는데 실패했습니다:", err);
        setError("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} ~ ${end}`;
  };

  if (loading) return <Container><Spinner /></Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;


  return (
    <>
      {/* 히어로 섹션 - 특집 영화 */}
      {featuredMovie && (
        <HeroSection>
          <HeroImage src={featuredMovie.backdropUrl || featuredMovie.posterUrl} alt={featuredMovie.title} />
          <HeroContent>
            <HeroTitle>{featuredMovie.title}</HeroTitle>
            <HeroDescription>
              {featuredMovie.synopsis ?
                `${featuredMovie.synopsis.substring(0, 150)}...` :
                '지금 가장 인기있는 영화를 확인하세요!'}
            </HeroDescription>
            <Button to={`/movies/${featuredMovie.id}`}>자세히 보기</Button>
          </HeroContent>
        </HeroSection>
      )}

      <Container>
        {/* 현재 상영작 섹션 */}
        <Section>
          <SectionTitle>현재 상영작</SectionTitle>
          <MovieSlider movies={nowPlayingMovies} />
          <ViewAllLink to="/movies?showing=true">모든 상영작 보기 &gt;</ViewAllLink>
        </Section>

        {/* 상영 예정작 섹션 */}
        <Section>
          <SectionTitle>상영 예정작</SectionTitle>
          <MovieSlider movies={comingSoonMovies} />
          <ViewAllLink to="/movies?showing=false">모든 상영 예정작 보기 &gt;</ViewAllLink>
        </Section>

        {/* 이벤트 섹션 */}
        <Section>
          <SectionTitle>진행 중인 이벤트</SectionTitle>
          <EventGrid>
            {events.map(event => (
              <EventCard key={event.id} to={`/events/${event.id}`}>
                <EventImage src={event.imageUrl} alt={event.title} />
                <EventInfo>
                  <EventTitle>{event.title}</EventTitle>
                  <EventPeriod>{formatDateRange(event.startDate, event.endDate)}</EventPeriod>
                </EventInfo>
              </EventCard>
            ))}
          </EventGrid>
          <ViewAllLink to="/events">모든 이벤트 보기 &gt;</ViewAllLink>
        </Section>

        {/* 극장 섹션 */}
        <Section>
          <SectionTitle>지역별 극장</SectionTitle>
          <TheaterGrid>
            {theaters.map((item, index) => (
              <TheaterCard key={index} to={`/theaters?location=${item.location}`}>
                <TheaterName>{item.location}</TheaterName>
                <TheaterLocation>{item.count}개 극장</TheaterLocation>
              </TheaterCard>
            ))}
          </TheaterGrid>
          <ViewAllLink to="/theaters">모든 극장 보기 &gt;</ViewAllLink>
        </Section>
      </Container>
    </>
  );
};

export default HomePage;