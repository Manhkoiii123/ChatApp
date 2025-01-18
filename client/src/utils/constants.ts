/* eslint-disable @typescript-eslint/no-explicit-any */
export const HOST = (import.meta as any).env.VITE_SERVER_URL;
export const AUTH_ROUTES = "/api/auth";
export const SIGN_UP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
