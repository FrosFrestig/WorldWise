import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import Homepage from "./pages/Homepage";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import AppLayout from "./pages/AppLayout";
import { useEffect, useState } from "react";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

const URL = "http://localhost:9000";

function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();

        setCities(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  const router = createBrowserRouter([
    { index: true, element: <Homepage /> },
    { path: "product", element: <Product /> },
    { path: "pricing", element: <Pricing /> },
    {
      path: "app",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Navigate replace to="cities" />,
        },
        {
          path: "cities",
          element: <CityList cities={cities} isLoading={isLoading} />,
        },

        { path: "cities/:id", element: <City /> },
        {
          path: "countries",
          element: <CountryList cities={cities} isLoading={isLoading} />,
        },
        { path: "form", element: <Form /> },
      ],
    },
    { path: "/login", element: <Login /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
