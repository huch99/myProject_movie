import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Movie } from '../../types/movie.types';
import MovieCard from './MovieCard';

interface MovieListProps {
    title?: string;
    movies: Movie[];
    loading?: boolean;
    error?: string | null;
    showFilter?: boolean;
    showPagination?: boolean;
    itemsPerPage?: number;
}

const Container = styled.div`
  margin-bottom: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  background-color: ${props => props.active ? '#e51937' : '#f1f1f1'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#c41730' : '#e1e1e1'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin: 0 5px;
  background-color: ${props => props.active ? '#e51937' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  border: ${props => props.active ? 'none' : '1px solid #ddd'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#c41730' : '#f1f1f1'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NoMoviesContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const MovieList: React.FC<MovieListProps> = ({
    title,
    movies,
    loading = false,
    error,
    showFilter = true,
    showPagination = true,
    itemsPerPage = 12,
}) => {
    const [filter, setFilter] = useState<'all' | 'showing' | 'coming'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    // 필터링된 영화 목록
    const filteredMovies = movies.filter(movie => {
        if (filter === 'showing') return movie.isShowing;
        if (filter === 'coming') return !movie.isShowing;
        return true; // 'all'인 경우
    });

    // 페이지네이션을 위한 계산
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

    // 페이지 변경 시 맨 위로 스크롤
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage]);

    // 필터 변경 시 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 페이지네이션 버튼 생성 (최대 5개)
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        // 표시할 버튼이 maxButtons보다 적을 경우 startPage 조정
        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        // 이전 페이지 버튼
        buttons.push(
            <PageButton
                key="prev"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                &lt;
            </PageButton>
        );

        // 페이지 번호 버튼
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <PageButton
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </PageButton>
            );
        }

        // 다음 페이지 버튼
        buttons.push(
            <PageButton
                key="next"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                &gt;
            </PageButton>
        );

        return buttons;
    };

    if (loading) {
        return (
            <Container>
                {title && <Title>{title}</Title>}
                <LoadingContainer>영화 정보를 불러오는 중입니다...</LoadingContainer>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                {title && <Title>{title}</Title>}
                <ErrorContainer>
                    영화 정보를 불러오는 데 문제가 발생했습니다. 다시 시도해 주세요.
                    <br />
                    <small>{error}</small>
                </ErrorContainer>
            </Container>
        );
    }
    return (
        <Container>
            <Header>
                {title && <Title>{title}</Title>}

                {showFilter && (
                    <FilterContainer>
                        <FilterButton
                            active={filter === 'all'}
                            onClick={() => setFilter('all')}
                        >
                            전체
                        </FilterButton>
                        <FilterButton
                            active={filter === 'showing'}
                            onClick={() => setFilter('showing')}
                        >
                            현재 상영작
                        </FilterButton>
                        <FilterButton
                            active={filter === 'coming'}
                            onClick={() => setFilter('coming')}
                        >
                            상영 예정작
                        </FilterButton>
                    </FilterContainer>
                )}
            </Header>

            {currentMovies.length > 0 ? (
                <Grid>
                    {currentMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </Grid>
            ) : (
                <NoMoviesContainer>
                    표시할 영화가 없습니다.
                </NoMoviesContainer>
            )}

            {showPagination && totalPages > 1 && (
                <PaginationContainer>
                    {renderPaginationButtons()}
                </PaginationContainer>
            )}
        </Container>
    );
};

export default MovieList;