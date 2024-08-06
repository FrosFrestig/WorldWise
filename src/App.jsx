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
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesProvider } from "./contexts/CitiesContext";

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
        element: <CityList />,
      },

      { path: "cities/:id", element: <City /> },
      {
        path: "countries",
        element: <CountryList />,
      },
      { path: "form", element: <Form /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

function App() {
  return (
    <CitiesProvider>
      <RouterProvider router={router} />
    </CitiesProvider>
  );
}

export default App;
