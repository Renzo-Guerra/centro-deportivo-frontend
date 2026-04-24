import { jwtDecode, type JwtPayload } from "jwt-decode";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom";

interface AuthenticationContextType {
  user: JwtPayload | null,
  isLoading: boolean,
  logout: () => void,
}

export const AuthContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoading(false);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const checkToken = () => {
      setIsLoading(true);

      let jwt = localStorage.getItem("token");

      if (jwt) {
        try {
          const decoded = jwtDecode(jwt);

          // Si no existe la expiracion 
          if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
            console.error("El token expiró, por favor vuelva a loguearse")
            logout();
          } else {
            setUser(decoded);
          }
        } catch (err) {
          // Si hubo un error al obtener la expiracion
          logout();
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }

    checkToken();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        checkToken();
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    }
  }, [logout]);


  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("AuthContext debe ser utilizado dentro de AuthContextProvider!");
  }

  return context;
}