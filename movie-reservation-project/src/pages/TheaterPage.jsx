// 극장 목록 페이지
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchTheaters, selectRegion } from '../store/slices/theaterSlice';
import TheaterCard from '../components/theater/TheaterCard';
import RegionSelector from '../components/theater/RegionSelector';
import TheaterMap from '../components/theater/TheaterMap';
import SearchBar from '../components/common/SearchBar';
import Loading from '../components/common/Loading';
import useScrollToTop from '../hooks/useScrollToTop';

const TheaterPage = () => {
    // 스크롤을 맨 위로 이동
    useScrollToTop();

    const dispatch = useDispatch();
    const { theaters, regions, selectedRegion, loading, error } = useSelector((state) => state.theaters);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTheaters, setFilteredTheaters] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' 또는 'map'

    // 페이지 로드 시 극장 데이터 가져오기
    useEffect(() => {
       console.log('theaters fetching 실행');
        dispatch(fetchTheaters());
    }, [dispatch]);

    // 검색어나 선택된 지역이 변경될 때 극장 목록 필터링
    useEffect(() => {
      console.log('필터링 실행', theaters?.length, selectedRegion, searchQuery);
        if (!theaters) return;

        let filtered = [...theaters];

        // 지역으로 필터링
        if (selectedRegion && selectedRegion !== '전체') {
            filtered = filtered.filter(theater => theater.region === selectedRegion);
        }

        // 검색어로 필터링
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(theater =>
                theater.name.toLowerCase().includes(query) ||
                theater.address.toLowerCase().includes(query)
            );
        }

        setFilteredTheaters(filtered);
    }, [theaters, selectedRegion, searchQuery]);

    // 지역 선택 핸들러
    const handleRegionSelect = (region) => {
        dispatch(selectRegion(region));
    };

    // 검색어 변경 핸들러
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // 뷰 모드 변경 핸들러
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    if (loading && !theaters.length) {
        return <Loading />;
    }

    return (
        <TheaterPageContainer>
            <PageHeader>
                <h1>극장</h1>
                <p>원하시는 극장을 선택해 주세요.</p>
            </PageHeader>

            <SearchSection>
                <SearchBar
                    placeholder="극장명 또는 주소로 검색"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />

                <ViewToggle>
                    <ViewButton
                        active={viewMode === 'list'}
                        onClick={() => handleViewModeChange('list')}
                    >
                        목록 보기
                    </ViewButton>
                    <ViewButton
                        active={viewMode === 'map'}
                        onClick={() => handleViewModeChange('map')}
                    >
                        지도 보기
                    </ViewButton>
                </ViewToggle>
            </SearchSection>

            <RegionSection>
                <RegionSelector
                    regions={['전체', ...regions]}
                    selectedRegion={selectedRegion || '전체'}
                    onSelectRegion={handleRegionSelect}
                />
            </RegionSection>

            {error && (
                <ErrorMessage>
                    극장 정보를 불러오는데 실패했습니다. 다시 시도해 주세요.
                </ErrorMessage>
            )}

            {viewMode === 'list' ? (
                <TheaterListSection>
                    {filteredTheaters.length === 0 ? (
                        <NoResults>
                            <p>검색 결과가 없습니다.</p>
                            <p>다른 검색어나 지역을 선택해 주세요.</p>
                        </NoResults>
                    ) : (
                        <TheaterGrid>
                            {filteredTheaters.map(theater => (
                                <TheaterCard
                                    key={theater.id}
                                    theater={theater}
                                />
                            ))}
                        </TheaterGrid>
                    )}
                </TheaterListSection>
            ) : (
                <MapSection>
                    <TheaterMap theaters={filteredTheaters} />
                </MapSection>
            )}

            <FavoriteSection>
                <SectionTitle>자주 가는 극장</SectionTitle>
                <FavoriteTheaters />
            </FavoriteSection>

            <RecentSection>
                <SectionTitle>최근 본 극장</SectionTitle>
                <RecentTheaters />
            </RecentSection>
        </TheaterPageContainer>
    );
};

// 자주 가는 극장 컴포넌트
const FavoriteTheaters = () => {
    const { favoriteTheaters } = useSelector((state) => state.theaters);

    if (!favoriteTheaters || favoriteTheaters.length === 0) {
        return (
            <EmptyMessage>
                자주 가는 극장이 없습니다.
                <p>극장 상세 페이지에서 ♡ 버튼을 눌러 추가할 수 있습니다.</p>
            </EmptyMessage>
        );
    }

    return (
        <HorizontalScroll>
            {favoriteTheaters.map(theater => (
                <TheaterItem key={theater.id}>
                    <Link to={`/theaters/${theater.id}`}>
                        <TheaterName>{theater.name}</TheaterName>
                        <TheaterRegion>{theater.region}</TheaterRegion>
                    </Link>
                </TheaterItem>
            ))}
        </HorizontalScroll>
    );
};

// 최근 본 극장 컴포넌트
const RecentTheaters = () => {
    const { recentTheaters } = useSelector((state) => state.theaters);

    if (!recentTheaters || recentTheaters.length === 0) {
        return (
            <EmptyMessage>
                최근 본 극장이 없습니다.
            </EmptyMessage>
        );
    }

    return (
        <HorizontalScroll>
            {recentTheaters.map(theater => (
                <TheaterItem key={theater.id}>
                    <Link to={`/theaters/${theater.id}`}>
                        <TheaterName>{theater.name}</TheaterName>
                        <TheaterRegion>{theater.region}</TheaterRegion>
                    </Link>
                </TheaterItem>
            ))}
        </HorizontalScroll>
    );
};

// 스타일 컴포넌트
const TheaterPageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-sm);
  }
`;

const PageHeader = styled.div`
  margin: var(--spacing-xl) 0;
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--spacing-xs);
  }
  
  p {
    color: var(--color-text-secondary);
  }
`;

const SearchSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: ${({ active }) => active ? 'var(--color-primary)' : 'transparent'};
  color: ${({ active }) => active ? 'white' : 'var(--color-text-primary)'};
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: ${({ active }) => active ? 'var(--color-primary)' : 'var(--color-surface)'};
  }
`;

const RegionSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const TheaterListSection = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const TheaterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MapSection = styled.div`
  height: 600px;
  margin-bottom: var(--spacing-xl);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--box-shadow-md);
`;

const FavoriteSection = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const RecentSection = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
`;

const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: var(--border-radius-full);
  }
`;

const TheaterItem = styled.div`
  min-width: 180px;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  transition: var(--transition-fast);
  
  &:hover {
    box-shadow: var(--box-shadow-md);
    transform: translateY(-2px);
  }
`;

const TheaterName = styled.div`
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
`;

const TheaterRegion = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const EmptyMessage = styled.div`
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--color-text-secondary);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  
  p {
    margin-top: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
`;

const NoResults = styled.div`
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
  
  p:first-child {
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }
`;

const ErrorMessage = styled.div`
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  background-color: #fff0f0;
  color: var(--color-error);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-error);
  text-align: center;
`;

export default TheaterPage;