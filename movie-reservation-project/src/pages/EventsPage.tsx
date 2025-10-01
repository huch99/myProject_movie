import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';
import SectionTitle from '../components/common/SectionTitle';
import eventService, { type AppEvent } from '../service/eventService';

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
`;

const FilterButton = styled.button<{ $isActive?: boolean }>`
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

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 30px;
`;

const EventCard = styled(Link)`
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

const EventImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const EventInfo = styled.div`
  padding: 15px;
`;

const EventTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #333;
`;

const EventPeriod = styled.p`
  font-size: 0.9rem;
  color: #666;
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

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const eventsPerPage = 9;

    // 이벤트 카테고리 목록
    const categories = ['전체', '영화', '극장', '할인', '시사회', '기타'];

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const params: any = {
                    page: currentPage,
                    limit: eventsPerPage
                };

                if (selectedCategory && selectedCategory !== '전체') {
                    params.category = selectedCategory;
                }

                const response = await eventService.getEvents(params);
                setEvents(response.events);
                setTotalPages(response.totalPages);
            } catch (err) {
                console.error('이벤트 목록을 불러오는데 실패했습니다:', err);
                setError('이벤트 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentPage, selectedCategory]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // 페이지 변경 시 상단으로 스크롤
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category === '전체' ? null : category);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    };

    const formatDateRange = (startDate: string, endDate: string) => {
        const start = new Date(startDate).toLocaleDateString();
        const end = new Date(endDate).toLocaleDateString();
        return `${start} ~ ${end}`;
    };

    if (loading && currentPage === 1) return <Container><Spinner /></Container>;
    if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;

    return (
        <Container>
      <SectionTitle align="center">이벤트</SectionTitle>
      
      {/* 카테고리 필터 */}
      <FilterContainer>
        {categories.map((category) => (
          <FilterButton
            key={category}
            $isActive={category === '전체' ? selectedCategory === null : selectedCategory === category}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </FilterButton>
        ))}
      </FilterContainer>
      
      {/* 로딩 중이면서 첫 페이지가 아닌 경우에만 스피너 표시 */}
      {loading && currentPage !== 1 && <Spinner />}
      
      {/* 이벤트 목록 */}
      {!loading && events.length === 0 ? (
        <NoResults>진행 중인 이벤트가 없습니다.</NoResults>
      ) : (
        <EventGrid>
          {events.map((event) => (
            <EventCard key={event.id} to={`/events/${event.id}`}>
              <EventImage src={event.imageUrl} alt={event.title} />
              <EventInfo>
                <EventTitle>{event.title}</EventTitle>
                <EventPeriod>{formatDateRange(event.startDate, event.endDate)}</EventPeriod>
              </EventInfo>
            </EventCard>
          ))}
        </EventGrid>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
    );
};

export default EventsPage;