import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserManager, User, Log, IdTokenClaims } from 'oidc-client-ts';
import { authConfig, userManager } from './keycloak';


export interface ExtendedUserProfile extends IdTokenClaims {
  roles?: string[]; // Define roles as an optional array of strings
}


interface AuthContextType {
  user: User | null;
  userManager: UserManager;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  renewToken: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  tokenExpiry: Date | null;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enable OIDC client logging in development
  if (import.meta.env.DEV) {
    Log.setLogger(console);
    Log.setLevel(Log.INFO);
  }

  const isAuthenticated = !!user && !user.expired;
  const tokenExpiry = user?.expires_at ? new Date(user.expires_at * 1000) : null;

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    const roles = user.profile?.roles || [];
    return Array.isArray(roles) && roles.includes(role);
  };

  const login = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await userManager.signinRedirect();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await userManager.signoutRedirect();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renewToken = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const newUser = await userManager.signinSilent();
      setUser(newUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token renewal failed';
      setError(errorMessage);
      console.error('Token renewal error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserLoaded = (user: User) => {
    setUser(user);
    setIsLoading(false);
    setError(null);
  };

  const handleUserUnloaded = () => {
    setUser(null);
    setIsLoading(false);
  };

  const handleSilentRenewError = (error: Error) => {
    console.error('Silent renew error:', error);
    setError('Token renewal failed');
  };

  const handleUserSignedOut = () => {
    setUser(null);
    setIsLoading(false);
  };

  const handleAccessTokenExpiring = () => {
    console.log('Access token expiring, attempting renewal...');
  };

  const handleAccessTokenExpired = () => {
    console.log('Access token expired');
    setError('Session expired. Please log in again.');
  };

  useEffect(() => {
    // Set up event listeners
    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addSilentRenewError(handleSilentRenewError);
    userManager.events.addUserSignedOut(handleUserSignedOut);
    userManager.events.addAccessTokenExpiring(handleAccessTokenExpiring);
    userManager.events.addAccessTokenExpired(handleAccessTokenExpired);

    // Check for existing user
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Handle callback if returning from authentication
        if (window.location.pathname === '/auth/callback') {
          const user = await userManager.signinRedirectCallback();
          setUser(user);
          window.history.replaceState({}, document.title, '/');
          return;
        }

        // Handle silent callback
        if (window.location.pathname === '/auth/silent') {
          await userManager.signinSilentCallback();
          return;
        }

        // Check for existing user
        const existingUser = await userManager.getUser();
        if (existingUser && !existingUser.expired) {
          setUser(existingUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (window.location.pathname === '/auth/callback') {
          window.history.replaceState({}, document.title, '/');
        }
        setError(err instanceof Error ? err.message : 'Authentication initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup event listeners
    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeSilentRenewError(handleSilentRenewError);
      userManager.events.removeUserSignedOut(handleUserSignedOut);
      userManager.events.removeAccessTokenExpiring(handleAccessTokenExpiring);
      userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
    };
  }, [userManager]);

  const value: AuthContextType = {
    user,
    userManager,
    login,
    logout,
    renewToken,
    isLoading,
    error,
    isAuthenticated,
    tokenExpiry,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
