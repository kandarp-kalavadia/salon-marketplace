import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import { userManager } from "../auth/keycloak";

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL+'/api/v1',
  prepareHeaders: async (headers, { endpoint }) => {
    // Skip authentication for public endpoints
    const publicEndpoints = [
      '/users/signup',
      '/salons/signup',
      '/salons/images',
      '/categories/images',
      '/salonservices/images',
      '/payments/webhook',
    ];
    const isPublic = publicEndpoints.some((path) => endpoint.includes(path));

    if (!isPublic) {
      try {
        // Fetch the current user from UserManager
        const user = await userManager.getUser();
        if (user && !user.expired && user.access_token) {
          headers.set('authorization', `Bearer ${user.access_token}`);
        }
      } catch (error) {
        console.error('Error fetching user for auth token:', error);
      }
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    try {
      // Attempt to renew the token
      const newUser = await userManager.signinSilent();
      if (newUser && !newUser.expired) {
        // Retry the original request with the new token
        return await baseQuery(args, api, extraOptions);
      } else {
        // Token renewal failed, trigger logout
        api.dispatch({ type: 'auth/logout' });
      }
    } catch (error) {
      console.error('Token renewal failed:', error);
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};