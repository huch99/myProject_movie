// src/components/home/MovieNews.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface NewsItem {
    id: number;
    title: string;
    summary: string;
    imageUrl: string;
    date: string;
    link: string;
}

interface MovieNewsProps {
    title: string;
    news: NewsItem[];
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

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
`;

const NewsCard = styled(Link)`
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const NewsImage = styled.img`
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
`;

const NewsContent = styled.div`
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NewsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`;

const NewsSummary = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
  flex: 1;
  
  // 3줄 이상은 말줄임표로 표시
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NewsDate = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin: 0;
`;

const MovieNews: React.FC<MovieNewsProps> = ({
    title,
    news,
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

            <NewsGrid>
                {news.map(item => (
                    <NewsCard key={item.id} to={item.link}>
                        <NewsImage src={item.imageUrl} alt={item.title} />
                        <NewsContent>
                            <NewsTitle>{item.title}</NewsTitle>
                            <NewsSummary>{item.summary}</NewsSummary>
                            <NewsDate>{item.date}</NewsDate>
                        </NewsContent>
                    </NewsCard>
                ))}
            </NewsGrid>
        </Container>
    );
};

export default MovieNews;