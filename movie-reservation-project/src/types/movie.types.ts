export interface Movie {
  id: number;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseDate: string;
  runtime: number;
  rating: number;
  genres: string[];
  director?: string;
  actors?: string[];
  synopsis: string;
  ageRating: string;
  isShowing: boolean;
}

export interface Review {
  id: number;
  movieId: number;
  userId: number;
  username: string;
  rating: number;
  content: string;
  createdAt: string;
}