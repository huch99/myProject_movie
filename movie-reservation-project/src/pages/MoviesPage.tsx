import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Movie } from '../types/movie.types';
import movieService from '../service/movieService';
import MovieCard from '../components/movies/MovieCard';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const ErrorMessage = styled.div`
  color: #e51937;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 50px;
`;
const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const moviesPerPage = 12; // 한 페이지에 보여줄 영화 수

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        // movieService.getMovies()는 MovieSearchResponse 타입을 반환해야 합니다.
        const response = await movieService.getMovies({
          page: currentPage,
          limit: moviesPerPage,
          isShowing: true, // 현재 상영작만 가져오는 예시
        });
        setMovies(response.movies);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("영화 목록을 불러오는데 실패했습니다:", err);
        setError("영화 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, moviesPerPage]); // 페이지나 한 페이지당 영화 수가 변경될 때 다시 호출

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <Container><Spinner /></Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;
  return (
    <Container>
      <Title>현재 상영작</Title>
      <MovieGrid>
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <ErrorMessage>현재 상영 중인 영화가 없습니다.</ErrorMessage>
        )}
      </MovieGrid>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
};

export default MoviesPage;