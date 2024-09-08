import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useState, React } from "react";

const GlobalContext = createContext<{
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: unknown | null;
  setUser: React.Dispatch<React.SetStateAction<unknown | null>>;
  isLoading: boolean;
}>({
  isLogged: false,
  setIsLogged: () => {},
  user: null,
  setUser: () => {},
  isLoading: true,
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: React.ReactNode) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<unknown | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getCurrentUser]);

  return (
    <GlobalContext.Provider
      value={{ isLogged, setIsLogged, user, setUser, isLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
