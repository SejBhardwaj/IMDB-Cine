/**
 * Server Actions for Data Layer
 * 
 * Server-side functions for data fetching and cache management.
 * Used in React Server Components.
 */

'use server';

import { movieRepository } from '@/repositories/MovieRepository';
import type { 
  MovieDetails, 
  PaginatedResponse, 
  Movie, 
  SearchQuery, 
  DiscoverOptions,
  Credits,
  VideoCollection,
  ImageCollection
} from '@/types/movie';

/**
 * Initialize repository (singleton pattern for server)
 */
async function getRepository() {
  return movieRepository;
}

/**
 * Server Action: Get movie by ID
 */
export async function getMovieAction(id: number | string): Promise<Movie> {
  const repo = await getRepository();
  return repo.getMovie(id as number);
}

/**
 * Server Action: Get movie details with all related data
 */
export async function getMovieDetailsAction(id: number): Promise<MovieDetails> {
  const repo = await getRepository();
  return repo.getMovieDetails(id);
}

/**
 * Server Action: Get popular movies
 */
export async function getPopularMoviesAction(page: number = 1): Promise<PaginatedResponse<Movie>> {
  const repo = await getRepository();
  return repo.getPopularMovies(page);
}

/**
 * Server Action: Get top-rated movies
 */
export async function getTopRatedMoviesAction(page: number = 1): Promise<PaginatedResponse<Movie>> {
  const repo = await getRepository();
  return repo.getTopRatedMovies(page);
}

/**
 * Server Action: Get now playing movies
 */
export async function getNowPlayingMoviesAction(page: number = 1): Promise<PaginatedResponse<Movie>> {
  const repo = await getRepository();
  return repo.getNowPlayingMovies(page);
}

/**
 * Server Action: Get upcoming movies
 */
export async function getUpcomingMoviesAction(page: number = 1): Promise<PaginatedResponse<Movie>> {
  const repo = await getRepository();
  return repo.getUpcomingMovies(page);
}

/**
 * Server Action: Search movies
 */
export async function searchMoviesAction(
  query: string,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  const repo = await getRepository();
  return repo.searchMovies({ query, page });
}

/**
 * Server Action: Get movie recommendations
 */
export async function getRecommendationsAction(
  movieId: number,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  const repo = await getRepository();
  return repo.getRecommendedMovies(movieId, page);
}

/**
 * Server Action: Get similar movies
 */
export async function getSimilarMoviesAction(
  movieId: number,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  const repo = await getRepository();
  return repo.getSimilarMovies(movieId, page);
}

/**
 * Server Action: Get movie credits
 */
export async function getMovieCreditsAction(movieId: number): Promise<Credits> {
  const repo = await getRepository();
  return repo.getMovieCredits(movieId);
}

/**
 * Server Action: Get movie videos
 */
export async function getMovieVideosAction(movieId: number): Promise<VideoCollection> {
  const repo = await getRepository();
  return repo.getMovieVideos(movieId);
}

/**
 * Server Action: Get movie images
 */
export async function getMovieImagesAction(movieId: number): Promise<ImageCollection> {
  const repo = await getRepository();
  // movieRepository doesn't have getMovieImages, return empty collection
  return { backdrops: [], posters: [], logos: [] };
}

/**
 * Server Action: Discover by genre
 */
export async function discoverByGenreAction(
  genreId: number,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  const repo = await getRepository();
  return repo.discoverMovies({ with_genres: String(genreId), page });
}

/**
 * Server Action: Get image URL
 */
export async function getImageUrlAction(path: string, size?: 'small' | 'medium' | 'large' | 'original'): Promise<string> {
  // Simple image URL builder for TMDB
  const sizeMap = {
    small: 'w185',
    medium: 'w500',
    large: 'w780',
    original: 'original'
  };
  const sizeStr = size ? sizeMap[size] : 'w500';
  return `https://image.tmdb.org/t/p/${sizeStr}${path}`;
}

/**
 * Server Action: Prefetch movie (for hover prefetching)
 */
export async function prefetchMovieAction(id: number): Promise<void> {
  const repo = await getRepository();
  await repo.getMovie(id);
}

/**
 * Server Action: Batch get movies
 */
export async function getMoviesBatchAction(ids: number[]): Promise<Movie[]> {
  const repo = await getRepository();
  return Promise.all(ids.map(id => repo.getMovie(id)));
}

/**
 * Server Action: Invalidate movie cache
 */
export async function invalidateMovieCacheAction(id: number | string): Promise<void> {
  const repo = await getRepository();
  repo.invalidateMovie(id as number);
}

/**
 * Server Action: Invalidate cache by list type
 */
export async function invalidateCacheByListAction(listType: string): Promise<void> {
  const repo = await getRepository();
  repo.invalidateList(listType);
}

/**
 * Get repository statistics (for debugging)
 */
export async function getRepositoryStatsAction() {
  const repo = await getRepository();
  return repo.getCacheStats();
}
