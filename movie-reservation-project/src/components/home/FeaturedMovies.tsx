// src/components/home/FeaturedMovies.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie.types';


interface FeaturedMoviesProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  error?: string;
  viewAllLink?: string;
}

const Container = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

// src/components/home/FeaturedMovies.tsx (이어서)
const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 40px;
    height: 3px;
    background-color: #e51937;
  }
`;

const ViewAllLink = styled(Link)`
  color: #e51937;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
`;

const MovieCard = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PosterContainer = styled.div`
  position: relative;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Poster = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
`;

const Rating = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const AgeRating = styled.div<{ rating: string }>`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${props => {
    switch (props.rating) {
      case 'ALL': return '#4CAF50';
      case '12': return '#2196F3';
      case '15': return '#FF9800';
      case '18': return '#F44336';
      default: return '#999';
    }
  }};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const MovieTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MovieInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 50px 0;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 30px;
  color: #e51937;
`;

const FeaturedMovies: React.FC<FeaturedMoviesProps> = ({
  title,
  movies,
  loading,
  error,
  viewAllLink,
}) => {
  if (loading) {
    return (
      <Container>
        <SectionHeader>
          <Title>{title}</Title>
        </SectionHeader>
        <LoadingState>영화 정보를 불러오는 중입니다...</LoadingState>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <SectionHeader>
          <Title>{title}</Title>
        </SectionHeader>
        <ErrorState>{error}</ErrorState>
      </Container>
    );
  }
  
  return (
    <Container>
      <SectionHeader>
        <Title>{title}</Title>
        {viewAllLink && (
          <ViewAllLink to={viewAllLink}>
            더 보기 &rarr;
          </ViewAllLink>
        )}
      </SectionHeader>
      
      <MoviesGrid>
        {movies.map(movie => (
          <MovieCard key={movie.id} to={`/movies/${movie.id}`}>
            <PosterContainer>
              <Poster src={movie.posterUrl} alt={movie.title} />
              <Rating>
                <span>★</span> {movie.rating.toFixed(1)}
              </Rating>
              <AgeRating rating={movie.ageRating}>
                {movie.ageRating === 'ALL' ? '전체' : movie.ageRating}
              </AgeRating>
            </PosterContainer>
            <MovieTitle>{movie.title}</MovieTitle>
            <MovieInfo>{movie.genres.join(', ')}</MovieInfo>
          </MovieCard>
        ))}
      </MoviesGrid>
    </Container>
  );
};

export default FeaturedMovies;

