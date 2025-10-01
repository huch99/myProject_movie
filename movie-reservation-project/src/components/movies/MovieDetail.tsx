import React, { useState } from 'react';
import type { Movie } from '../../types/movie.types';
import styled from 'styled-components';
import Button from '../common/Button';
import MovieCard from './MovieCard';
import MovieTrailer from './MovieTrailer';

interface MovieDetailProps {
    movie: Movie;
    similarMovies?: Movie[];
    loading?: boolean;
    error?: string;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BackdropContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
`;

const Backdrop = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BackdropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
  padding: 30px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PosterContainer = styled.div`
  flex: 0 0 300px;
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
    max-width: 250px;
    margin: 0 auto;
  }
`;

const Poster = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const InfoContainer = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0 0 10px 0;
  font-size: 2rem;
  font-weight: 700;
`;

const OriginalTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  font-weight: 400;
  color: #666;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tag = styled.span`
  padding: 4px 12px;
  background-color: #f1f1f1;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #333;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
  margin-bottom: 20px;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #666;
`;

const InfoValue = styled.div`
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 30px;
`;

const SynopsisContainer = styled.div`
  margin-bottom: 40px;
`;

const SynopsisTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const Synopsis = styled.p`
  line-height: 1.6;
  color: #333;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  margin: 40px 0 20px;
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

const SimilarMoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
`;

const MovieDetail: React.FC<MovieDetailProps> = ({
    movie,
    similarMovies = [],
    loading = false,
    error,
}) => {
    const [showTrailer, setShowTrailer] = useState(false);

    // 개봉일 포맷팅 (YYYY-MM-DD -> YYYY.MM.DD)
    const formatReleaseDate = (dateString: string) => {
        return dateString.replace(/-/g, '.');
    };

    // 러닝타임을 시간과 분으로 변환
    const formatRuntime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}시간 ${mins}분`;
    };

    if (loading) {
        return (
            <Container>
                <LoadingContainer>영화 정보를 불러오는 중입니다...</LoadingContainer>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <ErrorContainer>
                    영화 정보를 불러오는 데 문제가 발생했습니다. 다시 시도해 주세요.
                    <br />
                    <small>{error}</small>
                </ErrorContainer>
            </Container>
        );
    }
    return (
        <>
            <BackdropContainer>
                <Backdrop src={movie.backdropUrl || movie.posterUrl} alt={movie.title} />
                <BackdropOverlay />
            </BackdropContainer>

            <Container>
                <ContentContainer>
                    <PosterContainer>
                        <Poster src={movie.posterUrl} alt={movie.title} />
                    </PosterContainer>

                    <InfoContainer>
                        <Title>{movie.title}</Title>
                        {movie.originalTitle && movie.originalTitle !== movie.title && (
                            <OriginalTitle>{movie.originalTitle}</OriginalTitle>
                        )}

                        <TagsContainer>
                            <Tag>{movie.ageRating === 'ALL' ? '전체관람가' : `${movie.ageRating}세 이상`}</Tag>
                            {movie.genres.map((genre, index) => (
                                <Tag key={index}>{genre}</Tag>
                            ))}
                        </TagsContainer>

                        <InfoGrid>
                            <InfoLabel>개봉일</InfoLabel>
                            <InfoValue>{formatReleaseDate(movie.releaseDate)}</InfoValue>

                            <InfoLabel>상영시간</InfoLabel>
                            <InfoValue>{formatRuntime(movie.runtime)}</InfoValue>

                            <InfoLabel>평점</InfoLabel>
                            <InfoValue>★ {movie.rating.toFixed(1)}</InfoValue>

                            {movie.director && (
                                <>
                                    <InfoLabel>감독</InfoLabel>
                                    <InfoValue>{movie.director}</InfoValue>
                                </>
                            )}

                            {movie.actors && movie.actors.length > 0 && (
                                <>
                                    <InfoLabel>출연</InfoLabel>
                                    <InfoValue>{movie.actors.join(', ')}</InfoValue>
                                </>
                            )}
                        </InfoGrid>

                        <ButtonContainer>
                            <Button
                                variant='primary'
                                size='large'
                                onClick={() => window.location.href = "/booking"}
                            >
                                예매하기
                            </Button>
                            <Button
                                variant="outline"
                                size="large"
                                onClick={() => setShowTrailer(true)}
                            >
                                예고편 보기
                            </Button>
                        </ButtonContainer>
                    </InfoContainer>
                </ContentContainer>

                <SynopsisContainer>
                    <SynopsisTitle>줄거리</SynopsisTitle>
                    <Synopsis>{movie.synopsis}</Synopsis>
                </SynopsisContainer>

                {similarMovies.length > 0 && (
                    <>
                        <SectionTitle>비슷한 영화</SectionTitle>
                        <SimilarMoviesGrid>
                            {similarMovies.slice(0, 4).map(similarMovie => (
                                <MovieCard key={similarMovie.id} movie={similarMovie} />
                            ))}
                        </SimilarMoviesGrid>
                    </>
                )}
            </Container>

            {showTrailer && (
                <MovieTrailer
                    movieId={movie.id}
                    title={movie.title}
                    onClose={() => setShowTrailer(false)}
                />
            )}
        </>
    );
};

export default MovieDetail;