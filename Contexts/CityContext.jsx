import { createContext, useCallback, useEffect, useReducer } from "react";

const CityContext = createContext();
const Base_URL = "http://localhost:9000/cities";

const initialObj = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reduce(state, action) {
  switch (action.type) {
    case "setCities":
      return { ...state, cities: action.payload };
    case "loading":
      return { ...state, isLoading: action.payload };
    case "currentCity":
      return { ...state, currentCity: action.payload };
    default:
      throw new Error(
        "Something unexpected happen in reduce function of useReducer hook"
      );
  }
}

function CityProvider({ children }) {
  const [state, dispatch] = useReducer(reduce, initialObj);
  const { cities, isLoading, currentCity } = state;

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading", payload: true });
        const res = await fetch(Base_URL);
        const data = await res.json();
        dispatch({ type: "setCities", payload: data });
      } catch (error) {
        console.log(error.message);
      } finally {
        dispatch({ type: "loading", payload: false });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      try {
        if (Number(id) === currentCity.id) return;
        dispatch({ type: "loading", payload: true });
        const res = await fetch(`${Base_URL}/${id}`);
        const data = await res.json();
        dispatch({ type: "currentCity", payload: data });
      } catch (error) {
        console.log(error.message);
      } finally {
        dispatch({ type: "loading", payload: false });
      }
    },
    [currentCity.id]
  );

  async function createCity(cityObj) {
    try {
      dispatch({ type: "loading", payload: true });
      const res = await fetch(`${Base_URL}`, {
        method: "POST",
        body: JSON.stringify(cityObj),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "setCities", payload: [...cities, data] });
      dispatch({ type: "currentCity", payload: data });
    } catch (err) {
      throw new Error(err.message);
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading", payload: true });
      const res = await fetch(`${Base_URL}/${id}`, {
        method: "DELETE",
      });
      const data = res.status;
      console.log(data);
      dispatch({
        type: "setCities",
        payload: cities.filter((city) => city.id !== id),
      });
    } catch (err) {
      throw new Error(err.message);
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        dispatch,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export { CityProvider, CityContext };
