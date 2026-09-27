import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("hr_portal_user");
      return saved
        ? JSON.parse(saved)
        : {
            name: "Amruthavarshini S",
            email: "amruthavarshinisubramanian@gmail.com",
            role: "HR Administrator",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amruthavarshini",
          };
    } catch {
      return {
        name: "Amruthavarshini S",
        email: "amruthavarshinisubramanian@gmail.com",
        role: "HR Administrator",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amruthavarshini",
      };
    }
  });

  const login = (userData) => {
    const fullUser = {
      name: userData.name || (userData.email ? userData.email.split("@")[0] : "Admin User"),
      email: userData.email,
      role: userData.role || "HR Administrator",
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || "Admin"}`,
    };
    setUser(fullUser);
    localStorage.setItem("hr_portal_user", JSON.stringify(fullUser));
  };

  const logout = () => {
    localStorage.removeItem("hr_portal_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
