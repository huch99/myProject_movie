import { Link, useParams } from "react-router";
import Spinner from "../components/common/Spinner";
import eventService from "../service/eventService";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: 50px auto;
  padding: 0 20px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: #666;
  text-decoration: none;
  
  &:hover {
    color: #e51937;
  }
`;

const EventHeader = styled.div`
  margin-bottom: 30px;
`;

const EventTitle = styled.h1`
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 15px;
`;

const EventPeriod = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
`;

const EventCategory = styled.span`
  display: inline-block;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border-radius: 20px;
  color: #333;
  font-size: 0.9rem;
`;

const EventImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const EventContent = styled.div`
  line-height: 1.8;
  color: #333;
  font-size: 1.1rem;
  
  img {
    max-width: 100%;
    margin: 20px 0;
  }
`;

const ErrorMessage = styled.div`
  color: #e51937;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 50px;
`;

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) {
        setError("이벤트 ID가 제공되지 않았습니다.");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const eventData = await eventService.getEventById(Number(id));
        setEvent(eventData);
      } catch (err) {
        console.error(`이벤트 (ID: ${id}) 정보를 불러오는데 실패했습니다:`, err);
        setError("이벤트 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetail();
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤
  }, [id]);
  
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} ~ ${end}`;
  };
  
  if (loading) return <Container><Spinner /></Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;
  if (!event) return <Container><ErrorMessage>해당 이벤트를 찾을 수 없습니다.</ErrorMessage></Container>;
  
  return (
    <Container>
      <BackLink to="/events">← 이벤트 목록으로 돌아가기</BackLink>
      
      <EventHeader>
        <EventTitle>{event.title}</EventTitle>
        <EventPeriod>{formatDateRange(event.startDate, event.endDate)}</EventPeriod>
        <EventCategory>{event.category}</EventCategory>
      </EventHeader>
      
      <EventImage src={event.imageUrl} alt={event.title} />
      
      <EventContent dangerouslySetInnerHTML={{ __html: event.content || '' }} />
    </Container>
  );
};

export default EventDetailPage;