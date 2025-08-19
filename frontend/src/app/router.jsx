import { createBrowserRouter } from "react-router-dom";
import RootLayout from './RootLayout';
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import MyAccount from "../pages/MyAccount";
import RegisterPage from "../pages/RegisterPage";
import RentObjectDetails from "../pages/RentObjectDetails";

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'profile', element: <MyAccount /> },
      { path: 'register', element: <RegisterPage /> },
      { path: "listings/:id", element: <RentObjectDetails />},
    ],
  },
]);

export default router;