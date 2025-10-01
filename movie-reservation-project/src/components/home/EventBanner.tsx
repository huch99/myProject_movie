// src/components/home/EventBanner.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface Event {
    id: number;
    title: string;
    imageUrl: string;
    date: string;
    link: string;
}

interface EventBannerProps {
    title: string;
    events: Event[];
    viewAllLink?: string;
}

const Container = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 40px;
    height: 3px;
    background-color: #e51937;
  }
`;

const ViewAllLink = styled(Link)`
  color: #e51937;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
`;

const EventCard = styled(Link)`
  display: block;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const EventImage = styled.img`
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
`;

const EventContent = styled.div`
  padding: 15px;
`;

const EventTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
`;

const EventDate = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const EventBanner: React.FC<EventBannerProps> = ({
    title,
    events,
    viewAllLink,
}) => {
    return (
        <Container>
            <SectionHeader>
                <Title>{title}</Title>
                {viewAllLink && (
                    <ViewAllLink to={viewAllLink}>
                        더 보기 &rarr;
                    </ViewAllLink>
                )}
            </SectionHeader>

            <EventGrid>
                {events.map(event => (
                    <EventCard key={event.id} to={event.link}>
                        <EventImage src={event.imageUrl} alt={event.title} />
                        <EventContent>
                            <EventTitle>{event.title}</EventTitle>
                            <EventDate>{event.date}</EventDate>
                        </EventContent>
                    </EventCard>
                ))}
            </EventGrid>
        </Container>
    );
};

export default EventBanner;