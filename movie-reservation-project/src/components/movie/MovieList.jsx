import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { fetchNowPlayingMovies, fetchComingSoonMovies, fetchPopularMovies } from '../../store/slices/movieSlice';
import MovieCard from './MovieCard';
import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import { PAGINATION } from '../../styles/variables';

/**
 * 영화 목록을 표시하는 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.type - 영화 목록 유형 (nowPlaying, comingSoon, popular)
 * @param {number} props.initialPage - 초기 페이지 번호
 * @param {number} props.moviesPerPage - 페이지당 영화 수
 * @param {Object} props.filter - 필터링 옵션
 */
const MovieList = ({
    type = 'nowPlaying',
    initialPage = 0,
    moviesPerPage = PAGINATION.MOVIES_PER_PAGE,
    filter = {}
}) => {
    const dispatch = useDispatch();
    const { nowPlaying, comingSoon, popular, loading, error } = useSelector(state => state.movies);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    // 영화 목록 유형에 따른 데이터 가져오기
    useEffect(() => {
        const fetchMovies = () => {
            switch (type) {
                case 'nowPlaying':
                    dispatch(fetchNowPlayingMovies({ page: currentPage, size: moviesPerPage, ...filter }));
                    break;
                case 'comingSoon':
                    dispatch(fetchComingSoonMovies({ page: currentPage, size: moviesPerPage, ...filter }));
                    break;
                case 'popular':
                    dispatch(fetchPopularMovies({ page: currentPage, size: moviesPerPage, ...filter }));
                    break;
                default:
                    dispatch(fetchNowPlayingMovies({ page: currentPage, size: moviesPerPage, ...filter }));
            }
        };

        fetchMovies();
    }, [dispatch, type, currentPage, moviesPerPage, filter]);

    // 영화 데이터 및 필터링 처리
    useEffect(() => {
        let movies = [];

        switch (type) {
            case 'nowPlaying':
                movies = nowPlaying?.content || [];
                setTotalPages(nowPlaying?.totalPages || 1);
                break;
            case 'comingSoon':
                movies = comingSoon?.content || [];
                setTotalPages(comingSoon?.totalPages || 1);
                break;
            case 'popular':
                movies = popular?.content || [];
                setTotalPages(popular?.totalPages || 1);
                break;
            default:
                movies = nowPlaying?.content || [];
                setTotalPages(nowPlaying?.totalPages || 1);
        }

        // 필터링 적용 (예: 장르별, 평점별 등)
        if (filter.genre) {
            movies = movies.filter(movie =>
                movie.genres && movie.genres.some(genre => genre.id === filter.genre)
            );
        }

        if (filter.minRating) {
            movies = movies.filter(movie =>
                movie.averageRating >= filter.minRating
            );
        }

        setFilteredMovies(movies);
    }, [type, nowPlaying, comingSoon, popular, filter]);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // 페이지 변경 시 상단으로 스크롤
        window.scrollTo(0, 0);
    };

    // 타이틀 설정
    const getTitle = () => {
        switch (type) {
            case 'nowPlaying':
                return '현재 상영작';
            case 'comingSoon':
                return '개봉 예정작';
            case 'popular':
                return '인기 영화';
            default:
                return '영화 목록';
        }
    };

    if (loading && filteredMovies.length === 0) {
        return <Loading text="영화 정보를 불러오는 중입니다..." />;
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <MovieListContainer>
            <ListHeader>
                <ListTitle>{getTitle()}</ListTitle>
                <MovieCount>{filteredMovies.length}개의 영화</MovieCount>
            </ListHeader>

            {filteredMovies.length === 0 ? (
                <NoMoviesMessage>
                    조건에 맞는 영화가 없습니다.
                </NoMoviesMessage>
            ) : (
                <>
                    <MoviesGrid>
                        {filteredMovies.map(movie => (
                            <MovieCardWrapper key={movie.id}>
                                <MovieCard
                                    movie={movie}
                                    showRating={true}
                                    showReservation={type === 'nowPlaying'}
                                />
                            </MovieCardWrapper>
                        ))}
                    </MoviesGrid>

                    {totalPages > 1 && (
                        <PaginationWrapper>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </PaginationWrapper>
                    )}
                </>
            )}
        </MovieListContainer>
    );
};

// 스타일 컴포넌트
const MovieListContainer = styled.div`
  width: 100%;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ListTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const MovieCount = styled.span`
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  
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

const MovieCardWrapper = styled.div`
  height: 100%;
`;

const PaginationWrapper = styled.div`
  margin-top: var(--spacing-xl);
  display: flex;
  justify-content: center;
`;

const NoMoviesMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-error);
  font-size: var(--font-size-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-error);
`;

MovieList.propTypes = {
    type: PropTypes.oneOf(['nowPlaying', 'comingSoon', 'popular']),
    initialPage: PropTypes.number,
    moviesPerPage: PropTypes.number,
    filter: PropTypes.object
};

export default MovieList;