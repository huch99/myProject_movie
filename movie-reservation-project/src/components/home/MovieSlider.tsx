// src/components/home/MovieSlider.tsx
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie.types';
import { formatAgeRating } from '../../utils/formatters';

const SliderContainer = styled.div`
  position: relative;
  margin: 30px 0;
`;

const SliderTrack = styled.div`
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  padding: 10px 0;
`;

const SlideItem = styled.div<{ $active: boolean }>`
  flex: 0 0 auto;
  width: 200px;
  margin-right: 20px;
  transition: all 0.3s;
  opacity: ${props => props.$active ? 1 : 0.7};
  transform: ${props => props.$active ? 'scale(1.05)' : 'scale(1)'};
`;

const MovieCard = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const PosterContainer = styled.div`
  position: relative;
  height: 300px;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AgeRating = styled.div<{ rating: string }>`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
  color: white;
  background-color: ${props => {
    switch (props.rating) {
      case '전체': return '#00AA54';
      case '12세': return '#0064DD';
      case '15세': return '#EDA813';
      case '19세': return '#E73C3C';
      default: return '#666';
    }
  }};
`;

const MovieInfo = styled.div`
  padding: 12px;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReleaseDate = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
`;

const Star = styled.span`
  color: #ffb400;
  margin-right: 5px;
`;

const SliderButton = styled.button<{ direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'prev' ? 'left: -20px;' : 'right: -20px;'}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptySlider = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border-radius: 8px;
  color: #666;
  font-size: 1.1rem;
`;

interface MovieSliderProps {
  movies: Movie[];
  title?: string;
}

const MovieSlider: React.FC<MovieSliderProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // 화면 크기에 따라 보여질 슬라이드 수와 최대 인덱스 계산
  useEffect(() => {
    const calculateMaxIndex = () => {
      if (!trackRef.current) return;

      const trackWidth = trackRef.current.clientWidth;
      const slideWidth = 220; // 슬라이드 너비 + 마진
      const visibleSlides = Math.floor(trackWidth / slideWidth);
      const newMaxIndex = Math.max(0, movies.length - visibleSlides);

      setMaxIndex(newMaxIndex);
    };

    calculateMaxIndex();

    // 윈도우 리사이즈 시 최대 인덱스 재계산
    window.addEventListener('resize', calculateMaxIndex);
    return () => window.removeEventListener('resize', calculateMaxIndex);
  }, [movies.length]);

  // 슬라이드 이동 함수
  const handleSlide = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
    }
  };

  // 슬라이드 트랙 스크롤 위치 조정
  useEffect(() => {
    if (trackRef.current) {
      const slideWidth = 220; // 슬라이드 너비 + 마진
      trackRef.current.scrollLeft = currentIndex * slideWidth;
    }
  }, [currentIndex]);

  if (!movies || movies.length === 0) {
    return <EmptySlider>표시할 영화가 없습니다.</EmptySlider>;
  }

  return (
    <SliderContainer>
      <SliderButton
        direction="prev"
        onClick={() => handleSlide('prev')}
        disabled={currentIndex === 0}
      >
        &lt;
      </SliderButton>

      <SliderTrack ref={trackRef}>
        {movies.map((movie, index) => (
          <SlideItem key={movie.id} $active={index === currentIndex}>
            <MovieCard to={`/movies/${movie.id}`}>
              <PosterContainer>
                <Poster src={movie.posterUrl} alt={movie.title} />
                {movie.ageRating && (
                  <AgeRating rating={formatAgeRating(movie.ageRating)}>
                    {formatAgeRating(movie.ageRating)}
                  </AgeRating>
                )}
              </PosterContainer>
              <MovieInfo>
                <Title>{movie.title}</Title>
                <ReleaseDate>
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </ReleaseDate>
                {movie.rating && (
                  <Rating>
                    <Star>★</Star> {movie.rating.toFixed(1)}
                  </Rating>
                )}
              </MovieInfo>
            </MovieCard>
          </SlideItem>
        ))}
      </SliderTrack>

      <SliderButton
        direction="next"
        onClick={() => handleSlide('next')}
        disabled={currentIndex >= maxIndex}
      >
        &gt;
      </SliderButton>
    </SliderContainer>
  );
};

export default MovieSlider;