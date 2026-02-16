import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  setStudentProfile,
  setAlumniProfile,
  setLoading,
  setError,
} from '../store/profileSlice';
import profileService from '../services/profile';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { studentProfile, alumniProfile, loading, error } = useSelector(
    state => state.profile
  );

  const fetchStudentProfile = useCallback(async (userId) => {
    dispatch(setLoading(true));
    try {
      const response = await profileService.getStudentProfile(userId);
      dispatch(setStudentProfile(response.data.profile));
    } catch (err) {
      dispatch(setError(err.message));
    }
  }, [dispatch]);

  const fetchAlumniProfile = useCallback(async (userId) => {
    dispatch(setLoading(true));
    try {
      const response = await profileService.getAlumniProfile(userId);
      dispatch(setAlumniProfile(response.data.profile));
    } catch (err) {
      dispatch(setError(err.message));
    }
  }, [dispatch]);

  return {
    studentProfile,
    alumniProfile,
    loading,
    error,
    fetchStudentProfile,
    fetchAlumniProfile,
  };
};
