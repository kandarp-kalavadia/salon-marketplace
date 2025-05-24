import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { UserManagerSettings } from 'oidc-client-ts';


export const authConfig: UserManagerSettings = {
  authority: import.meta.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8000/realms/salon-realm',
  client_id: import.meta.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'react-app',
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  automaticSilentRenew: true,
  loadUserInfo: true,
  monitorSession: true,
  checkSessionIntervalInSeconds: 10000,
  revokeTokensOnSignout: true,
  includeIdTokenInSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};



export const userManager = new UserManager(authConfig);