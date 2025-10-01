import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import type { Theater } from '../types/theater.types';
import theaterService from '../service/theaterService';
import Spinner from '../components/common/Spinner';
import SectionTitle from '../components/common/SectionTitle';

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const LocationFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
`;

const LocationButton = styled.button<{ $isActive?: boolean }>`
  padding: 8px 16px;
  background-color: ${props => props.$isActive ? '#e51937' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#333'};
  border: 1px solid ${props => props.$isActive ? '#e51937' : '#ddd'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$isActive ? '#c41730' : '#f5f5f5'};
  }
`;

const TheaterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const TheaterCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const TheaterImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const TheaterInfo = styled.div`
  padding: 15px;
`;

const TheaterName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #333;
`;

const TheaterAddress = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
`;

const TheaterFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const TheaterFeature = styled.span`
  font-size: 0.8rem;
  padding: 3px 8px;
  background-color: #f0f0f0;
  border-radius: 12px;
  color: #555;
`;

const SearchContainer = styled.div`
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e51937;
  }
`;

const NoResults = styled.div`
  text-align: center;
  margin: 50px 0;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #e51937;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 50px;
`;

const TheaterPage: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 극장 목록 및 지역 목록 가져오기
  useEffect(() => {
    const fetchTheaters = async () => {
      setLoading(true);
      setError(null);
      try {
        // 지역 목록 가져오기
        const locationList = await theaterService.getLocations();
        setLocations(['전체', ...locationList]);

        // 극장 목록 가져오기 (지역 필터링 또는 검색어 적용)
        const params: any = {};

        if (selectedLocation && selectedLocation !== '전체') {
          params.location = selectedLocation;
        }

        if (searchTerm) {
          params.query = searchTerm;
        }

        const response = await theaterService.getTheaters(params);
        setTheaters(response.theaters);
      } catch (err) {
        console.error('극장 목록을 불러오는데 실패했습니다:', err);
        setError('극장 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, [selectedLocation, searchTerm]);

  // 지역 필터 변경 핸들러
  const handleLocationFilter = (location: string) => {
    setSelectedLocation(location === '전체' ? null : location);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <Container><Spinner /></Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;

  return (
    <Container>
      <SectionTitle>극장</SectionTitle>

      {/* 검색 */}
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="극장명 또는 지역명을 입력하세요"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchContainer>

      {/* 지역 필터 */}
      <LocationFilter>
        {locations.map((location) => (
          <LocationButton
            key={location}
            $isActive={location === '전체' ? selectedLocation === null : selectedLocation === location}
            onClick={() => handleLocationFilter(location)}
          >
            {location}
          </LocationButton>
        ))}
      </LocationFilter>

      {/* 극장 목록 */}
      {theaters.length === 0 ? (
        <NoResults>검색 결과가 없습니다.</NoResults>
      ) : (
        <TheaterGrid>
          {theaters.map((theater) => (
            <TheaterCard key={theater.id} to={`/theaters/${theater.id}`}>
              <TheaterImage src={theater.imageUrl || 'https://via.placeholder.com/300x180?text=극장+이미지'} alt={theater.name} />
              <TheaterInfo>
                <TheaterName>{theater.name}</TheaterName>
                <TheaterAddress>{theater.address}</TheaterAddress>
                <TheaterFeatures>
                  {theater.features && theater.features.map((feature, index) => (
                    <TheaterFeature key={index}>{feature}</TheaterFeature>
                  ))}
                </TheaterFeatures>
              </TheaterInfo>
            </TheaterCard>
          ))}
        </TheaterGrid>
      )}
    </Container>
  );
};

export default TheaterPage;