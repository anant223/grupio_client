import CenteredSpinner from '@/components/common/LoadingSpinner'
import useAuth from '@/hooks/useAuth'
import React from 'react'
import { Navigate} from 'react-router-dom'

const MainRoute = ({ children }) => {
  const { user, isAuthenticated, initialized } = useAuth();

  if (!initialized) return <CenteredSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth?type=login" replace />;
  if (!user?.onboardingCompleted) return <Navigate to="/onboarding" replace />;

  return children;
};

export default MainRoute
