
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return null;

    const parsedUser = JSON.parse(storedUser);

    if (
      !parsedUser ||
      typeof parsedUser !== "object" ||
      Array.isArray(parsedUser)
    ) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }

    return parsedUser;
  } catch (error) {
    console.error("Unable to restore user session:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  // Synchronize authentication state with other browser tabs.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user" || event.key === "token") {
        setUser(getStoredUser());
        window.dispatchEvent(new Event("cartUpdated"));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = useCallback((userData) => {
    if (!userData || typeof userData !== "object") {
      throw new Error("Invalid login response.");
    }

    try {
      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.token) {
        localStorage.setItem("token", userData.token);
      } else {
        localStorage.removeItem("token");
      }

      setUser(userData);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Unable to save login session:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
