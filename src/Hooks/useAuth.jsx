import { useContext } from "react";
import { AuthContext } from "../../Contexts/FakeAuthContext";

function useAuth() {
  const value = useContext(AuthContext);
  if (value === undefined)
    throw new Error("Contect is used before Auth Provider");
  return value;
}

export default useAuth;
