import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router';
import type { Movie } from '../types/movie.types';
import movieService from '../service/movieService';
import Button from '../components/common/Button';
import { formatAgeRating, formatRuntime } from '../utils/formatters';
import Spinner from '../components/common/Spinner';
import SimilarMovies from '../components/movies/SimilarMovies';
import MovieRatings from '../components/movies/MovieRatings';
import SectionTitle from '../components/common/SectionTitle';

const DetailContainer = styled.div`
  max-width: 1000px;
  margin: 50px auto;
  padding: 0 20px;
`;

const MovieHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Poster = styled.img`
  width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const MovieInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 10px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const OriginalTitle = styled.h2`
  font-size: 1.4rem;
  color: #666;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const MetaInfo = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 8px;
  span {
    font-weight: 600;
    margin-right: 5px;
  }
`;

const Genres = styled.div`
  margin-bottom: 15px;
  span {
    display: inline-block;
    background-color: #f0f0f0;
    color: #666;
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 8px;
    font-size: 0.9rem;
  }
`;

const ActionButtons = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ErrorMessage = styled.div`
  color: #e51937;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 50px;
`;

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터에서 ID 가져오기
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!id) {
        setError("영화 ID가 제공되지 않았습니다.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const movieData = await movieService.getMovieById(Number(id));
        setMovie(movieData);
      } catch (err) {
        console.error(`영화 (ID: ${id}) 정보를 불러오는데 실패했습니다:`, err);
        setError("영화 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]); // ID가 변경될 때마다 다시 호출

  if (loading) return <DetailContainer><Spinner /></DetailContainer>;
  if (error) return <DetailContainer><ErrorMessage>{error}</ErrorMessage></DetailContainer>;
  if (!movie) return <DetailContainer><ErrorMessage>해당 영화를 찾을 수 없습니다.</ErrorMessage></DetailContainer>;

  return (
    <DetailContainer>
      <MovieHeader>
        <Poster src={movie.posterUrl} alt={movie.title} />
        <MovieInfo>
          <Title>{movie.title}</Title>
          <OriginalTitle>{movie.originalTitle}</OriginalTitle>
          <MetaInfo>
            <span>개봉일:</span> {movie.releaseDate.toString()}
          </MetaInfo>
          {movie.runtime && (
            <MetaInfo>
              <span>러닝타임:</span> {formatRuntime(movie.runtime)}
            </MetaInfo>
          )}
          {movie.rating && (
            <MetaInfo>
              <span>평점:</span> {movie.rating.toFixed(1)} / 10
            </MetaInfo>
          )}
          {movie.ageRating && (
            <MetaInfo>
              <span>관람등급:</span> {formatAgeRating(movie.ageRating)}
            </MetaInfo>
          )}
          {movie.director && (
            <MetaInfo>
              <span>감독:</span> {movie.director}
            </MetaInfo>
          )}
          {movie.actors && movie.actors.length > 0 && (
            <MetaInfo>
              <span>출연:</span> {movie.actors.join(', ')}
            </MetaInfo>
          )}
          {movie.genres && movie.genres.length > 0 && (
            <Genres>
              {movie.genres.map((genre, index) => (
                <span key={index}>{genre}</span>
              ))}
            </Genres>
          )}
          <ActionButtons>
            <Button variant="primary" onClick={() => navigate('/booking', { state: { movieId: movie.id } })}>
              예매하기
            </Button>
            <Button variant="secondary">
              찜하기
            </Button>
          </ActionButtons>
        </MovieInfo>
      </MovieHeader>
      {/* 비슷한 영화 섹션 */}
      {SimilarMovies.length > 0 && (
        <>
          <SectionTitle>비슷한 영화</SectionTitle>
          <SimilarMovies movies={similarMovies} />
        </>
      )}

      {/* 평점 및 리뷰 섹션 */}
      <SectionTitle>관람객 평점</SectionTitle>
      <MovieRatings movieId={Number(id)} />
    </DetailContainer>
  );
};

export default MovieDetailPage;