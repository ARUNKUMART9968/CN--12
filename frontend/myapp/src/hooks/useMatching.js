import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRecommendations, setLoading, setError } from '../store/matchSlice';
import matchingService from '../services/matching';

export const useMatching = () => {
  const dispatch = useDispatch();
  const { recommendations, loading, error } = useSelector(state => state.match);

  const fetchRecommendations = useCallback(async (userId, page = 1) => {
    dispatch(setLoading(true));
    try {
      const response = await matchingService.getStudentRecommendations(userId, page);
      dispatch(setRecommendations(response.data));
    } catch (err) {
      dispatch(setError(err.message));
    }
  }, [dispatch]);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
  };
};
