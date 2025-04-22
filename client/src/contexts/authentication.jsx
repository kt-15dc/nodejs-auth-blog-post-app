import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const navigate = useNavigate();

  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const login = async (data) => {
    const result = await axios.post("http://localhost:4000/auth/login", data);

    const token = result.data.token;

    localStorage.setItem("token", token);

    const userDataFromToken = jwtDecode(token);

    setState({ ...state, user: userDataFromToken });

    navigate("/");
  };

  const register = async (data) => {
    try {
      await axios.post("http://localhost:4000/auth/register", data); // ✅ attempt to register
      navigate("/login"); // ✅ navigate on success
    } catch (error) {
      console.error("Registration failed:", error); // ✅ handle failure
      alert("Something went wrong. Please try again.");
    }
  };

  const logout = () => {
    // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage
    localStorage.removeItem("token");
    setState({ ...state, user: null });
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
