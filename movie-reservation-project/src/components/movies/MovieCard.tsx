import React from 'react';
import type { Movie } from '../../types/movie.types';
import styled from 'styled-components';
import { Link } from 'react-router';

interface MovieCardProps {
    movie: Movie;
    showRating?: boolean;
}

const Card = styled(Link)`
  display: block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none;
  color: inherit;
  background-color: white;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const AgeRating = styled.div<{ rating: string }>`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${props => {
        switch (props.rating) {
            case 'ALL': return '#00AA51';
            case '12': return '#FFC107';
            case '15': return '#FF9800';
            case '18': return '#E51937';
            default: return '#666666';
        }
    }};
`;

const Rating = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #FFD700;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StarIcon = styled.span`
  font-size: 14px;
`;

const CardContent = styled.div`
  padding: 12px;
`;

const Title = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OriginalTitle = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #666;
`;

const ReleaseDate = styled.span``;

const Runtime = styled.span``;

const BookButton = styled.button`
  display: block;
  width: 100%;
  padding: 8px 0;
  margin-top: 8px;
  background-color: #e51937;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c41730;
  }
`;

const MovieCard: React.FC<MovieCardProps> = ({ movie, showRating = true }) => {
    // 러닝타임을 시간과 분으로 변환
    const formatRuntime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}시간 ${mins}분`;
    };

    // 개봉일 포맷팅 (YYYY-MM-DD -> YYYY.MM.DD)
    const formatReleaseDate = (dateString: string) => {
        return dateString.replace(/-/g, '.');
    };

    return (
        <Card to={`/movies/${movie.id}`}>
            <PosterContainer>
                <Poster src={movie.posterUrl} alt={movie.title} />
                <AgeRating rating={movie.ageRating}>
                    {movie.ageRating === 'ALL' ? '전체' : movie.ageRating}
                </AgeRating>

                {showRating && (
                    <Rating>
                        <StarIcon>★</StarIcon>
                        {movie.rating.toFixed(1)}
                    </Rating>
                )}
            </PosterContainer>

            <CardContent>
                <Title>{movie.title}</Title>
                {movie.originalTitle && movie.originalTitle !== movie.title && (
                    <OriginalTitle>{movie.originalTitle}</OriginalTitle>
                )}

                <Info>
                    <ReleaseDate>{formatReleaseDate(movie.releaseDate)}</ReleaseDate>
                    <Runtime>{formatRuntime(movie.runtime)}</Runtime>
                </Info>

                <BookButton onClick={(e) => {
                    e.preventDefault(); // 링크 이동 방지
                    window.location.href = '/booking'; // 예매 페이지로 이동
                }}>
                    예매하기
                </BookButton>
            </CardContent>
        </Card>
    );
};



export default MovieCard;