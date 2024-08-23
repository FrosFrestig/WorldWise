import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

const intialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "isLoading":
      return {
        ...state,
        isLoading: true,
      };

    case "cities/loaded":
      return {
        ...state,
        cities: payload,
        isLoading: false,
      };

    case "city/loaded":
      return {
        ...state,
        currentCity: payload,
        isLoading: false,
      };

    case "city/created":
      return {
        ...state,
        cities: [...state.cities, payload],
        isLoading: false,
        currentCity: payload,
      };

    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== payload),
        isLoading: false,
        currentCity: {},
      };

    case "error":
      return {
        ...state,
        error: payload,
      };

    default:
      throw new Error("Unknow event");
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [{ cities, currentCity, isLoading }, dispatch] = useReducer(
    reducer,
    intialState
  );

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "isLoading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "error",
          payload: "There was an error while loading the cities",
        });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    if (currentCity.id === +id) return;
    try {
      dispatch({ type: "isLoading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({
        type: "error",
        payload: "There was an error while loading the city",
      });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "isLoading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "error",
        payload: "There was an error while adding the city",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "isLoading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "error",
        payload: "Ther was an error while deleting the city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const value = useContext(CitiesContext);
  if (!value)
    throw new Error(
      "Trying to access cities context outside of cities provider"
    );
  return value;
}

export { CitiesProvider };
export default useCities;
