/**
 * TanStack Query Hooks
 * 
 * Type-safe React hooks for data fetching with automatic caching, deduplication, and background refresh
 * 
 * SECURITY: All data fetching goes through Server Actions to keep TMDB API key server-side
 */

'use client';

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import type {
  Movie,
  MovieDetails,
  PaginatedResponse,
  SearchQuery,
  DiscoverOptions,
  Credits,
  VideoCollection,
  Genre,
} from '@/types/movie';
import {
  getPopularMoviesAction,
  getTopRatedMoviesAction,
  getNowPlayingMoviesAction,
  getUpcomingMoviesAction,
  getMovieAction,
  getMovieDetailsAction,
  getMovieCreditsAction,
  getMovieVideosAction,
  getSimilarMoviesAction,
  getRecommendationsAction,
  searchMoviesAction,
} from '@/lib/data/serverActions';
import { queryKeys } from './keys';
import { STALE_TIMES, CACHE_TIMES } from './client';

// ===== MOVIE QUERIES =====

/**
 * Get movie by ID
 */
export function useMovie(
  id: number,
  options?: Omit<UseQueryOptions<Movie>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.movie(id),
    queryFn: () => getMovieAction(id),
    staleTime: STALE_TIMES.MOVIE_DETAILS,
    gcTime: CACHE_TIMES.MOVIE_DETAILS,
    ...options,
  });
}

/**
 * Get movie details with all related data
 */
export function useMovieDetails(
  id: number,
  options?: Omit<UseQueryOptions<MovieDetails>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => getMovieDetailsAction(id),
    staleTime: STALE_TIMES.MOVIE_DETAILS,
    gcTime: CACHE_TIMES.MOVIE_DETAILS,
    ...options,
  });
}

/**
 * Get movie credits
 */
export function useMovieCredits(
  id: number,
  options?: Omit<UseQueryOptions<Credits>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.credits(id),
    queryFn: () => getMovieCreditsAction(id),
    staleTime: STALE_TIMES.CREDITS,
    gcTime: CACHE_TIMES.CREDITS,
    ...options,
  });
}

/**
 * Get movie videos
 */
export function useMovieVideos(
  id: number,
  options?: Omit<UseQueryOptions<VideoCollection>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.videos(id),
    queryFn: () => getMovieVideosAction(id),
    staleTime: STALE_TIMES.MOVIE_DETAILS,
    gcTime: CACHE_TIMES.MOVIE_DETAILS,
    ...options,
  });
}

// ===== MOVIE LISTS =====

/**
 * Get popular movies
 */
export function usePopularMovies(
  page: number = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<Movie>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.popularPage(page),
    queryFn: () => getPopularMoviesAction(page),
    staleTime: STALE_TIMES.POPULAR,
    gcTime: CACHE_TIMES.POPULAR,
    ...options,
  });
}

/**
 * Get trending movies
 */
export function useTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
  page: number = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<Movie>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.trendingPage(timeWindow, page),
    queryFn: () => getPopularMoviesAction(page), // Trending not in serverActions, use popular
    staleTime: STALE_TIMES.TRENDING,
    gcTime: CACHE_TIMES.TRENDING,
    ...options,
  });
}

/**
 * Get top rated movies
 */
export function useTopRatedMovies(
  page: number = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<Movie>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.topRatedPage(page),
    queryFn: () => getTopRatedMoviesAction(page),
    staleTime: STALE_TIMES.TOP_RATED,
    gcTime: CACHE_TIMES.TOP_RATED,
    ...options,
  });
}

/**
 * Get upcoming movies
 */
export function useUpcomingMovies(
  page: number = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<Movie>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.upcomingPage(page),
    queryFn: () => getUpcomingMoviesAction(page),
    staleTime: STALE_TIMES.UPCOMING,
    gcTime: CACHE_TIMES.UPCOMING,
    ...options,
  });
}

/**
 * Get now playing movies
 */
export function useNowPlayingMovies(
  page: number = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<Movie>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.nowPlayingPage(page),
    queryFn: () => getNowPlayingMoviesAction(page),
    staleTime: STALE_TIMES.NOW_PLAYING,
    gcTime: CACHE_TIMES.NOW_PLAYING,
    ...options,
  });
}

/**
 * Search movies
 */
export function useSearchMovies(
  query: SearchQuery,
  options?: Omit<UseQueryOptions<PaginatedResponse<Movie>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => searchMoviesAction(query.query, query.page || 1),
    staleTime: STALE_TIMES.SEARCH,
    gcTime: CACHE_TIMES.SEARCH,
    enabled: !!query.query && query.query.length > 0,
    ...options,
  });
}

/**
 * Discover movies with filters
 */
export function useDiscoverMovies(
  options: DiscoverOptions,
  queryOptions?: Omit<UseQueryOptions<PaginatedResponse<Movie>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.discover(options),
    queryFn: () => getPopularMoviesAction(options.page || 1), // Discover not in serverActions, use popular
    staleTime: STALE_TIMES.POPULAR,
    gcTime: CACHE_TIMES.POPULAR,
    ...queryOptions,
  });
}

/**
 * Get similar movies
 */
export function useSimilarMovies(
  id: number,
  page: number = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<Movie>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.similarPage(id, page),
    queryFn: () => getSimilarMoviesAction(id, page),
    staleTime: STALE_TIMES.MOVIE_DETAILS,
    gcTime: CACHE_TIMES.MOVIE_DETAILS,
    ...options,
  });
}

/**
 * Get recommended movies
 */
export function useRecommendedMovies(
  id: number,
  page: number = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<Movie>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.recommendationsPage(id, page),
    queryFn: () => getRecommendationsAction(id, page),
    staleTime: STALE_TIMES.MOVIE_DETAILS,
    gcTime: CACHE_TIMES.MOVIE_DETAILS,
    ...options,
  });
}

/**
 * Get genres
 */
export function useGenres(
  options?: Omit<UseQueryOptions<Genre[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.genres(),
    queryFn: async () => [] as Genre[], // Genres not in serverActions, return empty for now
    staleTime: STALE_TIMES.GENRES,
    gcTime: CACHE_TIMES.GENRES,
    ...options,
  });
}

// ===== INFINITE QUERIES =====

/**
 * Infinite popular movies
 */
export function useInfinitePopularMovies(
  options?: Omit<
    UseInfiniteQueryOptions<PaginatedResponse<Movie>, Error, InfiniteData<PaginatedResponse<Movie>>, readonly unknown[], number>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) {
  return useInfiniteQuery({
    queryKey: queryKeys.infinite.popular(),
    queryFn: ({ pageParam }) => getPopularMoviesAction(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: STALE_TIMES.POPULAR,
    gcTime: CACHE_TIMES.POPULAR,
    ...options,
  });
}

/**
 * Infinite trending movies
 */
export function useInfiniteTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
  options?: Omit<
    UseInfiniteQueryOptions<PaginatedResponse<Movie>, Error, InfiniteData<PaginatedResponse<Movie>>, readonly unknown[], number>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) {
  return useInfiniteQuery({
    queryKey: queryKeys.infinite.trending(timeWindow),
    queryFn: ({ pageParam }) => getPopularMoviesAction(pageParam), // Use popular as fallback
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: STALE_TIMES.TRENDING,
    gcTime: CACHE_TIMES.TRENDING,
    ...options,
  });
}

/**
 * Infinite top rated movies
 */
export function useInfiniteTopRatedMovies(
  options?: Omit<
    UseInfiniteQueryOptions<PaginatedResponse<Movie>, Error, InfiniteData<PaginatedResponse<Movie>>, readonly unknown[], number>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) {
  return useInfiniteQuery({
    queryKey: queryKeys.infinite.topRated(),
    queryFn: ({ pageParam }) => getTopRatedMoviesAction(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: STALE_TIMES.TOP_RATED,
    gcTime: CACHE_TIMES.TOP_RATED,
    ...options,
  });
}

/**
 * Infinite search results
 */
export function useInfiniteSearchMovies(
  query: SearchQuery,
  options?: Omit<
    UseInfiniteQueryOptions<PaginatedResponse<Movie>, Error, InfiniteData<PaginatedResponse<Movie>>, readonly unknown[], number>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) {
  return useInfiniteQuery({
    queryKey: queryKeys.infinite.search(query),
    queryFn: ({ pageParam }) => searchMoviesAction(query.query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: !!query.query && query.query.length > 0,
    staleTime: STALE_TIMES.SEARCH,
    gcTime: CACHE_TIMES.SEARCH,
    ...options,
  });
}

// ===== PREFETCH HOOKS =====

/**
 * Prefetch movie details on hover
 */
export function usePrefetchMovie() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.detail(id),
      queryFn: () => getMovieDetailsAction(id),
      staleTime: STALE_TIMES.MOVIE_DETAILS,
    });
  };
}

/**
 * Prefetch next page
 */
export function usePrefetchNextPage() {
  const queryClient = useQueryClient();

  return {
    popular: (page: number) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.popularPage(page + 1),
        queryFn: () => getPopularMoviesAction(page + 1),
        staleTime: STALE_TIMES.POPULAR,
      });
    },
    trending: (timeWindow: 'day' | 'week', page: number) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.trendingPage(timeWindow, page + 1),
        queryFn: () => getPopularMoviesAction(page + 1), // Use popular as fallback
        staleTime: STALE_TIMES.TRENDING,
      });
    },
    topRated: (page: number) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.topRatedPage(page + 1),
        queryFn: () => getTopRatedMoviesAction(page + 1),
        staleTime: STALE_TIMES.TOP_RATED,
      });
    },
  };
}

// ===== CACHE INVALIDATION =====

/**
 * Invalidate movie cache
 */
export function useInvalidateMovie() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.movie(id) });
    // Note: movieRepository.invalidateMovie(id) removed - handled server-side
  };
}

/**
 * Invalidate movie list cache
 */
export function useInvalidateMovieList() {
  const queryClient = useQueryClient();

  return (listType: 'popular' | 'trending' | 'top_rated' | 'upcoming' | 'now_playing') => {
    queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    // Note: movieRepository.invalidateList(listType) removed - handled server-side
  };
}
