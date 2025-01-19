import { apiClient } from "@/lib/api-client";
import Auth from "@/pages/auth";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import { createUserState, useAuthZustand } from "@/store/slices/authSlice";
import { GET_USER_INFO } from "@/utils/constants";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAuthZustand((state: createUserState) => state.user);
  const isAuthenticated = !!user;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAuthZustand((state: createUserState) => state.user);
  const isAuthenticated = !!user;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};
function App() {
  const user = useAuthZustand((state: createUserState) => state.user);
  const setUser = useAuthZustand((state: createUserState) => state.setUser);
  const removeUser = useAuthZustand(
    (state: createUserState) => state.removeUser
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.id) {
          setUser(res.data);
        } else {
          removeUser();
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    if (!user) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [removeUser, setUser, user]);
  if (loading) return <div>Loading...</div>;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
