import React from 'react';
import styled from 'styled-components';
import { BookingProvider } from '../context/BookingContext';
import BookingFlow from '../components/booking/BookingFlow';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 40px;
  font-weight: 700;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 50px;
    height: 4px;
    background-color: #e51937;
  }
`;

const BookingPage: React.FC = () => {
    return (
        <Container>
            <Title>영화 예매</Title>
            <BookingProvider>
                <BookingFlow />
            </BookingProvider>
        </Container>
    );
};

export default BookingPage;