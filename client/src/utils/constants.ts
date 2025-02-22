/* eslint-disable @typescript-eslint/no-explicit-any */
export const HOST = (import.meta as any).env.VITE_SERVER_URL;
export const AUTH_ROUTES = "/api/auth";
export const SIGN_UP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const CONTACT_ROUTE = "/api/contacts";
export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTE}/search`;
export const GET_DM_CONTACT_ROUTE = `${CONTACT_ROUTE}/get-contacts-for-dm`;
export const MESSAGES_ROUTE = "/api/messages";
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTE}/upload-file`;
