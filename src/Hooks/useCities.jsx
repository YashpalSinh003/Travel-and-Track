import { useContext } from "react";
import { CityContext } from "../../Contexts/CityContext";

function useCities() {
  const value = useContext(CityContext);
  if (value === undefined)
    throw new Error("Contect is used before it's provider");

  return value;
}

export default useCities;
