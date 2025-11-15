import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../config/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("profile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [loading, setLoading] = useState(true); // <- Added for private route to wait

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        axios.defaults.headers.common["X-JWT-Bearer"] = `${token}`;
        localStorage.setItem("token", token);

        try {
          const response = await axios.get(API.USER_PROFILE);
          if (response.data && response.data.user && response.data.user.user_id) {
            setProfile(response.data.user); // Adjusted to directly access the user object
            localStorage.setItem("profile", JSON.stringify(response.data.user));
          } else {
            console.warn("Invalid profile data from API", response.data);
            logout(); // If invalid, force logout
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          logout(); // Error fetching? Log out.
        }
      } else {
        delete axios.defaults.headers.common["X-JWT-Bearer"];
        localStorage.removeItem("token");
        setProfile(null);
        localStorage.removeItem("profile");
      }

      setLoading(false); // done either way
    };

    fetchProfile();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await axios.post(API.LOGIN, credentials);
      if (response.data.token) {
        setToken(response.data.token); // triggers useEffect to fetch profile
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setProfile(null);
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
  };

  const updateProfile = async () => {
    try {
      const response = await axios.get(API.USER_PROFILE);
      if (response.data && response.data.user && response.data.user.user_id) {
        setProfile(response.data.user); // Adjusted to directly access the user object
        localStorage.setItem("profile", JSON.stringify(response.data.user));
      } else {
        console.warn("Invalid profile update data from API", response.data);
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, login, logout, profile, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
