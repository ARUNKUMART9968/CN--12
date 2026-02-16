import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export const useAuth = () => {
  const { user, isAuthenticated, token, loading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    token,
    loading,
    error,
    handleLogout,
    isStudent: user?.role === 'student',
    isAlumni: user?.role === 'alumni',
  };
};
