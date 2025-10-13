// src/pages/WatchedMoviesPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchWatchedMovies } from '../store/slices/userSlice';
import Container from '../components/layout/Container';
import PageTitle from '../components/common/PageTitle';
import MovieCard from '../components/movie/MovieCard';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import Pagination from '../components/common/Pagination';
import { FaHistory } from 'react-icons/fa';

/**
 * 관람 내역 페이지 컴포넌트
 */
const WatchedMoviesPage = () => {
    const dispatch = useDispatch();
    const { watchedMovies, loading, error } = useSelector(state => state.user);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOption, setSortOption] = useState('watchedDate');

    // 페이지당 영화 수
    const moviesPerPage = 12;

    // 관람 영화 목록 불러오기
    useEffect(() => {
        dispatch(fetchWatchedMovies({
            page: currentPage,
            size: moviesPerPage,
            sort: sortOption
        }));
    }, [dispatch, currentPage, sortOption]);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // 페이지 상단으로 스크롤
        window.scrollTo(0, 0);
    };

    // 정렬 옵션 변경 핸들러
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(0); // 정렬 변경 시 첫 페이지로 이동
    };

    return (
        <Container>
            <PageHeader>
                <PageTitle>
                    <FaHistory />
                    <span>관람 내역</span>
                </PageTitle>

                <SortOptions>
                    <SortLabel>정렬:</SortLabel>
                    <SortSelect value={sortOption} onChange={handleSortChange}>
                        <option value="watchedDate">최근 관람순</option>
                        <option value="rating">평점순</option>
                        <option value="title">제목순</option>
                        <option value="releaseDate">개봉일순</option>
                    </SortSelect>
                </SortOptions>
            </PageHeader>

            {loading ? (
                <Loading text="관람 내역을 불러오는 중입니다..." />
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : watchedMovies?.content?.length > 0 ? (
                <>
                    <MovieGrid>
                        {watchedMovies.content.map(item => (
                            <MovieCard
                                key={item.movie.id}
                                movie={item.movie}
                                rating={item.rating}
                                watchDate={item.watchedDate}
                                showRating
                            />
                        ))}
                    </MovieGrid>

                    {watchedMovies.totalPages > 1 && (
                        <PaginationWrapper>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={watchedMovies.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </PaginationWrapper>
                    )}
                </>
            ) : (
                <EmptyState
                    icon={<FaHistory size={48} />}
                    title="관람 내역이 없습니다"
                    description="영화 관람 후 내역이 이곳에 표시됩니다"
                />
            )}
        </Container>
    );
};

// 스타일 컴포넌트
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const SortOptions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const SortLabel = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const SortSelect = styled.select`
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  font-size: var(--font-size-sm);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-error);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-error);
`;

export default WatchedMoviesPage;