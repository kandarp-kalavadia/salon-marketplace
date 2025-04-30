import React, { useEffect, useState } from "react";
import { userManager } from "../oidc/UserManager";
import { AuthContext } from "./AuthContext";
import { IdTokenClaims, User } from "oidc-client-ts";

export interface ExtendedUserProfile extends IdTokenClaims {
  roles?: string[]; // Define roles as an optional array of strings
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("AuthProvider  called");

  useEffect(() => {
    userManager
      .getUser()
      .then((oidcUser) => {
        setUser(oidcUser);
        setLoading(false); // Always set loading to false
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false); // Set loading to false on error
      });

    const onUserLoaded = (user: User) => {
      setUser(user);
      setLoading(false);
    };

    const onUserUnloaded = () => {
      setUser(null);
    };

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);

    return () => {
      console.log("Use Effect clean up of AuthProvider called");

      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, []);

  const login = () => userManager.signinRedirect();
  const logout = () => userManager.signoutRedirect();
  const token = () => user?.access_token || null;

  return (
    <AuthContext.Provider value={{ user, login, logout, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
