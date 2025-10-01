import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Theater } from '../../types/booking.types';
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

const SelectedMovieInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const MoviePoster = styled.img`
  width: 60px;
  border-radius: 4px;
`;

const MovieDetails = styled.div``;

const MovieTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const MovieInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const SelectionContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RegionList = styled.div`
  flex: 0 0 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const RegionItem = styled.div<{ active: boolean }>`
  padding: 12px 15px;
  cursor: pointer;
  background-color: ${props => props.active ? '#e51937' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  transition: all 0.2s;
  
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  
  &:hover {
    background-color: ${props => props.active ? '#e51937' : '#f5f5f5'};
  }
`;

const TheaterList = styled.div`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const TheaterItem = styled.div<{ active: boolean }>`
  padding: 12px 15px;
  cursor: pointer;
  background-color: ${props => props.active ? '#e51937' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  transition: all 0.2s;
  
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  
  &:hover {
    background-color: ${props => props.active ? '#e51937' : '#f5f5f5'};
  }
`;

const TheaterName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const TheaterAddress = styled.div`
  font-size: 0.85rem;
  color: ${props => props.color || '#666'};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// 예시 데이터 (실제로는 API에서 가져옵니다)
const mockRegions = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

const mockTheaters: { [key: string]: Theater[] } = {
    '서울': [
        { id: 1, name: '강남', location: '서울', address: '서울특별시 강남구 강남대로 438', screens: [] },
        { id: 2, name: '홍대', location: '서울', address: '서울특별시 마포구 양화로 147', screens: [] },
        { id: 3, name: '용산', location: '서울', address: '서울특별시 용산구 한강대로23길 55', screens: [] },
    ],
    '경기': [
        { id: 4, name: '수원', location: '경기', address: '경기도 수원시 팔달구 덕영대로 924', screens: [] },
        { id: 5, name: '분당', location: '경기', address: '경기도 성남시 분당구 황새울로360번길 42', screens: [] },
    ],
    // 다른 지역의 극장 정보도 추가...
};

const TheaterSelection: React.FC = () => {
    const { state, selectTheater, nextStep, prevStep } = useBooking();
    const { selectedMovie } = state;

    const [selectedRegion, setSelectedRegion] = useState<string>('서울');
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedRegion) {
            setLoading(true);
            // 실제 API 호출 대신 목업 데이터 사용
            setTimeout(() => {
                setTheaters(mockTheaters[selectedRegion] || []);
                setLoading(false);
            }, 300);
        }
    }, [selectedRegion]);

    const handleRegionSelect = (region: string) => {
        setSelectedRegion(region);
    };

    const handleTheaterSelect = (theater: Theater) => {
        selectTheater(theater);
    };

    const handleContinue = () => {
        if (state.selectedTheater) {
            nextStep();
        }
    };

    const handleBack = () => {
        prevStep();
    };

    if (!selectedMovie) {
        return (
            <Container>
                <Title>극장 선택</Title>
                <div>영화를 먼저 선택해 주세요.</div>
                <ButtonContainer>
                    <Button variant="outline" onClick={handleBack}>이전 단계로</Button>
                </ButtonContainer>
            </Container>
        );
    }
    return (
        <Container>
            <Title>극장 선택</Title>

            <SelectedMovieInfo>
                <MoviePoster src={selectedMovie.posterUrl} alt={selectedMovie.title} />
                <MovieDetails>
                    <MovieTitle>{selectedMovie.title}</MovieTitle>
                    <MovieInfo>
                        {selectedMovie.genres.join(', ')} | {selectedMovie.runtime}분 | {selectedMovie.ageRating === 'ALL' ? '전체관람가' : `${selectedMovie.ageRating}세 이상`}
                    </MovieInfo>
                </MovieDetails>
            </SelectedMovieInfo>

            <SelectionContainer>
                <RegionList>
                    {mockRegions.map(region => (
                        <RegionItem
                            key={region}
                            active={selectedRegion === region}
                            onClick={() => handleRegionSelect(region)}
                        >
                            {region}
                        </RegionItem>
                    ))}
                </RegionList>

                <TheaterList>
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            극장 정보를 불러오는 중...
                        </div>
                    ) : theaters.length > 0 ? (
                        theaters.map(theater => (
                            <TheaterItem
                                key={theater.id}
                                active={state.selectedTheater?.id === theater.id}
                                onClick={() => handleTheaterSelect(theater)}
                            >
                                <TheaterName>{theater.name}</TheaterName>
                                <TheaterAddress color={state.selectedTheater?.id === theater.id ? 'rgba(255, 255, 255, 0.8)' : undefined}>
                                    {theater.address}
                                </TheaterAddress>
                            </TheaterItem>
                        ))
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            선택한 지역에 극장이 없습니다.
                        </div>
                    )}
                </TheaterList>
            </SelectionContainer>

            <ButtonContainer>
                <Button variant="outline" onClick={handleBack}>
                    이전 단계로
                </Button>
                <Button
                    variant="primary"
                    disabled={!state.selectedTheater}
                    onClick={handleContinue}
                >
                    다음 단계로
                </Button>
            </ButtonContainer>
        </Container>
    );
};

export default TheaterSelection;