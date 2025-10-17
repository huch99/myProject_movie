// src/pages/MoviePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MovieList from '../components/movie/MovieList';
import MovieFilter from '../components/movie/MovieFilter';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ROUTE_PATHS from '../constants/routePaths';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../store/slices/movieSlice';

/**
 * 영화 목록 페이지
 * 현재 상영 중인 영화와 개봉 예정작을 필터링하여 보여줍니다.
 */
const MoviePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all', // 'all', 'now-playing', 'coming-soon'
    genre: 'all',
    sortBy: 'popularity', // 'popularity', 'rating', 'release-date'
  });

  const moviesData = useSelector(state => state.movies.movies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // useEffect(() => {
  //   const loadMovies = async () => {
  //     try {
  //       // setLoading(true);
  //       setMovies(moviesData);
  //       setFilteredMovies(moviesData);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('영화 데이터를 불러오는 중 오류가 발생했습니다:', error);
  //       setError('영화 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
  //       setLoading(false);
  //     }
  //   };

  //   loadMovies();
  // }, []);

  useEffect(() => {
    if (moviesData && moviesData.length > 0) {
      setMovies(moviesData);
      setFilteredMovies(moviesData);
      setLoading(false);
    }
  }, [moviesData]);


  // 필터 변경 시 영화 목록 필터링
  // useEffect(() => {
  //   if (!movies.length) return;    

  //   let result = [...movies];

  //   // 카테고리 필터링
  //   if (filters.category === 'now-playing') {
  //     result = result.filter(movie => new Date(movie.releaseDate) <= new Date());
  //   } else if (filters.category === 'coming-soon') {
  //     result = result.filter(movie => new Date(movie.releaseDate) > new Date());
  //   }

  //   // 장르 필터링
  //   if (filters.genre !== 'all') {
  //     result = result.filter(movie =>
  //       movie.genres.some(genre => genre.toLowerCase() === filters.genre.toLowerCase())
  //     );
  //   }

  //   // 정렬
  //   if (filters.sortBy === 'popularity') {
  //     result.sort((a, b) => b.popularity - a.popularity);
  //   } else if (filters.sortBy === 'rating') {
  //     result.sort((a, b) => b.rating - a.rating);
  //   } else if (filters.sortBy === 'release-date') {
  //     result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  //   }

  //   setFilteredMovies(result);
  // }, [filters, movies]);

  // 필터 변경 핸들러
  const handleFilterChange = (filterName, value) => {
    // setFilters(prev => ({
    //   ...prev,
    //   [filterName]: value
    // }));
  };

  // 영화 상세 페이지로 이동
  const handleMovieClick = (movieId) => {
    navigate(`${ROUTE_PATHS.MOVIE_DETAIL(movieId)}`);
  };

  if (loading) return <Loading message="영화 정보를 불러오는 중입니다..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <PageContainer>
      <PageHeader>
        <h1>영화</h1>
        <SubTitle>현재 상영 중인 영화와 개봉 예정작을 확인하세요</SubTitle>
      </PageHeader>

      <MovieFilter
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* {filteredMovies.length > 0 ? (
        <MovieList
          movies={filteredMovies}
          onMovieClick={handleMovieClick}
        />
      ) : (
        <NoResults>
          <p>검색 결과가 없습니다.</p>
          <p>다른 필터 옵션을 선택해 주세요.</p>
        </NoResults>
      )} */}
    </PageContainer>
  );
};

// 스타일 컴포넌트
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 0;
  
  p {
    margin: 0.5rem 0;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  p:first-child {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
  }
`;

export default MoviePage;