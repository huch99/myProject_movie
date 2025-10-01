import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Movie } from '../../types/movie.types';
import { useBooking } from '../../context/BookingContext';
import Button from '../common/Button';

const Container = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: ${props => props.active ? '#e51937' : '#f1f1f1'};
  color: ${props => props.active ? '#fff' : '#333'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#c41730' : '#ddd'};
  }
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MovieCard = styled.div<{ selected: boolean }>`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: ${props => props.selected ? '2px solid #e51937' : 'none'};
  transform: ${props => props.selected ? 'scale(1.02)' : 'scale(1)'};
  
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

const MovieInfo = styled.div`
  padding: 12px;
`;

const MovieTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MovieRating = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
`;

const StarIcon = styled.span`
  color: #FFD700;
  margin-right: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

// 예시 데이터 (실제로는 API에서 가져옵니다)
const mockMovies: Movie[] = [
    {
        id: 1,
        title: "듄: 파트 2",
        originalTitle: "Dune: Part Two",
        posterUrl: "https://example.com/posters/dune2.jpg",
        backdropUrl: "https://example.com/backdrops/dune2.jpg",
        releaseDate: "2024-02-28",
        runtime: 166,
        rating: 8.5,
        genres: ["SF", "모험", "드라마"],
        director: "드니 빌뇌브",
        actors: ["티모시 샬라메", "젠데이아", "레베카 퍼거슨"],
        synopsis: "아트레이드 가문의 후계자인 폴은 자신의 운명을 깨닫고 프레멘 전사들과 함께 하케넨 가문에 맞서 싸운다.",
        ageRating: "12",
        isShowing: true
    },
    // 더 많은 영화 데이터 추가...
];

const MovieSelection: React.FC = () => {
    const { state, selectMovie, nextStep } = useBooking();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filter, setFilter] = useState<'all' | 'showing' | 'coming'>('showing');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // API에서 영화 목록 가져오기 (실제로는 API 호출)
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                // 실제 API 호출 대신 목업 데이터 사용
                await new Promise(resolve => setTimeout(resolve, 500)); // API 호출 시뮬레이션
                setMovies(mockMovies);
                setLoading(false);
            } catch (err) {
                setError('영화 정보를 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const filteredMovies = movies.filter(movie => {
        if (filter === 'showing') return movie.isShowing;
        if (filter === 'coming') return !movie.isShowing;
        return true; // 'all'인 경우
    });

    const handleMovieSelect = (movie: Movie) => {
        selectMovie(movie);
    };

    const handleContinue = () => {
        if (state.selectedMovie) {
            nextStep();
        }
    };

    if (loading) {
        return <div>영화 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
            <Title>영화 선택</Title>
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

            <MoviesGrid>
                {filteredMovies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        selected={state.selectedMovie?.id === movie.id}
                        onClick={() => handleMovieSelect(movie)}
                    >
                        <PosterContainer>
                            <Poster src={movie.posterUrl} alt={movie.title} />
                            <AgeRating rating={movie.ageRating}>
                                {movie.ageRating === 'ALL' ? '전체' : movie.ageRating}
                            </AgeRating>
                        </PosterContainer>
                        <MovieInfo>
                            <MovieTitle>{movie.title}</MovieTitle>
                            <MovieRating>
                                <StarIcon>★</StarIcon> {movie.rating.toFixed(1)}
                            </MovieRating>
                        </MovieInfo>
                    </MovieCard>
                ))}
            </MoviesGrid>

            <ButtonContainer>
                <Button
                    variant="primary"
                    size="large"
                    disabled={!state.selectedMovie}
                    onClick={handleContinue}
                >
                    다음 단계로
                </Button>
            </ButtonContainer>
        </Container>
    );
};

export default MovieSelection;