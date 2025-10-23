import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// import { fetchNowPlayingMovies, fetchComingSoonMovies, fetchPopularMovies } from '../../store/slices/movieSlice';
import MovieCard from './MovieCard';
import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import { PAGINATION } from '../../styles/variables';
import movieService from '../../services/movieService';
import { setLoading, setError, setMovies } from '../../store/slices/movieSlice';

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
    const movies = useSelector(state => state.movies.movies);
    const { loading, error } = useSelector(state => state.movies.movies);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    // 영화 목록 유형에 따른 데이터 가져오기
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // 로딩 상태 설정 (Redux 액션)
                dispatch(setLoading(true));

                // 영화 목록 타입에 따라 다른 API 호출

                const response = await movieService.getAllMovies();
                // 영화 데이터 저장 (Redux 액션)
                dispatch(setMovies(response.data));
            } catch (error) {
                console.error('영화 데이터 로딩 실패:', error);
                dispatch(setError('영화 목록을 불러오는데 실패했습니다.'));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchMovies();
    }, [dispatch]);

    // 영화 데이터 및 필터링 처리
    useEffect(() => {
        try {
            setFilteredMovies(movies.data.content);
            // 페이지네이션 처리 (필요한 경우)
            // const calculatedTotalPages = Math.ceil(movies.content.length / moviesPerPage);
            // setTotalPages(calculatedTotalPages);

        } catch (error) {
            console.log('실행 실패', error);
        }

    }, [movies]);

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
                        {filteredMovies && filteredMovies.length > 0 ? (
                            filteredMovies.map(movie => (
                                <MovieCardWrapper key={movie.movieId}>
                                    <MovieCard
                                        movie={movie}
                                        showRating={true}
                                        showReservation={type === 'nowPlaying'}
                                    />
                                </MovieCardWrapper>
                            ))
                        ) : (
                            <p>표시할 영화가 없습니다.</p>
                        )}
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