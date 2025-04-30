import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export const userManager = new UserManager({
  authority: "http://localhost:8000/realms/salon-realm",
  client_id: "react-app",
  redirect_uri: "http://localhost:3000/callback",
  response_type: "code",
  scope: "openid profile email",
  post_logout_redirect_uri: "http://localhost:3000",
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
});
