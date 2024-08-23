import { createContext, useEffect, useContext, useReducer } from "react";
import supabase from "../config/supabase";

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
        // const res = await fetch(`${BASE_URL}/cities`);
        // const data = await res.json();

        let { data: cities, error } = await supabase.from("cities").select("*");

        if (error)
          throw new Error("Ther waas an error while loading the cities");

        dispatch({ type: "cities/loaded", payload: cities });
      } catch (err) {
        dispatch({
          type: "error",
          payload: err.message,
        });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    if (currentCity.id === +id) return;
    try {
      dispatch({ type: "isLoading" });

      let { data: city, error } = await supabase
        .from("cities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error("There was an error while loading the city");

      dispatch({ type: "city/loaded", payload: city });
    } catch (err) {
      dispatch({
        type: "error",
        payload: err.message,
      });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "isLoading" });

      const { data, error } = await supabase
        .from("cities")
        .insert([newCity])
        .select()
        .single();

      console.log(data);

      if (error) throw new Error("There was an error while adding the city");

      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "error",
        payload: err.message,
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "isLoading" });

      const { error } = await supabase.from("cities").delete().eq("id", id);
      if (error) throw new Error("Ther was an error while deleting the city");

      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "error",
        payload: err.message,
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
