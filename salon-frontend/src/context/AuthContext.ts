import { User } from "oidc-client-ts";
import { createContext } from "react";

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  token: () => string | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
