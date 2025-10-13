// src/pages/FavoriteMoviesPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchFavoriteMovies, toggleFavoriteMovie } from '../store/slices/userSlice';
import Container from '../components/layout/Container';
import PageTitle from '../components/common/PageTitle';
import MovieCard from '../components/movie/MovieCard';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import Pagination from '../components/common/Pagination';
import { FaHeart, FaSearch } from 'react-icons/fa';
import ROUTE_PATHS from '../constants/routePaths';

/**
 * 찜한 영화 목록 페이지 컴포넌트
 */
const FavoriteMoviesPage = () => {
    const dispatch = useDispatch();
    const { favoriteMovies, loading, error } = useSelector(state => state.user);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('addedDate');

    // 페이지당 영화 수
    const moviesPerPage = 12;

    // 찜한 영화 목록 불러오기
    useEffect(() => {
        dispatch(fetchFavoriteMovies({
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

    // 찜하기 토글 핸들러
    const handleToggleFavorite = (movieId, isFavorite) => {
        dispatch(toggleFavoriteMovie({ movieId, isFavorite }));
    };

    // 검색어 입력 핸들러
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 검색 필터링된 영화 목록
    const filteredMovies = favoriteMovies?.content
        ? favoriteMovies.content.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (movie.originalTitle && movie.originalTitle.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    return (
        <Container>
            <PageHeader>
                <PageTitle>
                    <FaHeart />
                    <span>찜한 영화</span>
                </PageTitle>

                <PageActions>
                    <SearchContainer>
                        <SearchIcon>
                            <FaSearch />
                        </SearchIcon>
                        <SearchInput
                            type="text"
                            placeholder="영화 검색..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </SearchContainer>

                    <SortSelect value={sortOption} onChange={handleSortChange}>
                        <option value="addedDate">최근 찜한 순</option>
                        <option value="title">제목순</option>
                        <option value="releaseDate">개봉일순</option>
                        <option value="rating">평점순</option>
                    </SortSelect>
                </PageActions>
            </PageHeader>

            {loading ? (
                <Loading text="찜한 영화 목록을 불러오는 중입니다..." />
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : favoriteMovies?.content?.length > 0 ? (
                <>
                    {searchTerm && filteredMovies.length === 0 ? (
                        <NoSearchResults>
                            '{searchTerm}'에 대한 검색 결과가 없습니다.
                        </NoSearchResults>
                    ) : (
                        <>
                            <MovieGrid>
                                {(searchTerm ? filteredMovies : favoriteMovies.content).map(movie => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                        isFavorite={true}
                                        onToggleFavorite={() => handleToggleFavorite(movie.id, false)}
                                        showFavoriteButton
                                    />
                                ))}
                            </MovieGrid>

                            {!searchTerm && favoriteMovies.totalPages > 1 && (
                                <PaginationWrapper>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={favoriteMovies.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </PaginationWrapper>
                            )}
                        </>
                    )}
                </>
            ) : (
                <EmptyState
                    icon={<FaHeart size={48} />}
                    title="찜한 영화가 없습니다"
                    description="관심있는 영화를 찜해보세요!"
                    action={
                        <ActionButton as={Link} to={ROUTE_PATHS.MOVIES}>
                            영화 둘러보기
                        </ActionButton>
                    }
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const PageActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  @media (max-width: 576px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 250px;
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) var(--spacing-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const SortSelect = styled.select`
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  font-size: var(--font-size-sm);
  
  @media (max-width: 576px) {
    width: 100%;
  }
  
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

const NoSearchResults = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
`;

const ActionButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-xl);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

export default FavoriteMoviesPage;