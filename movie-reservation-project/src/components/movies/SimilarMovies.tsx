import { Link } from "react-router";
import styled from "styled-components";
import type { Movie } from "../../types/movie.types";
import type React from "react";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MovieItem = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MovieTitle = styled.h3`
  font-size: 1rem;
  margin-top: 8px;
  color: #333;
  text-align: center;
`;

interface SimilarMoviesProps {
  movies: Movie[];
}

const SimilarMovies: React.FC<SimilarMoviesProps> = ({ movies }) => {
  return (
    <Container>
      {movies.map(movie => (
        <MovieItem key={movie.id} to={`/movies/${movie.id}`}>
          <MoviePoster src={movie.posterUrl} alt={movie.title} />
          <MovieTitle>{movie.title}</MovieTitle>
        </MovieItem>
      ))}
    </Container>
  );
};

export default SimilarMovies;