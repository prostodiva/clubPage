import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from './root/Root.tsx'
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage.tsx";
import MeetingsPage from "./pages/MeetingsPage.tsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: '/events',
                element: <EventsPage />,
            },
            {
                path: '/meetings',
                element: <MeetingsPage />,
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/register',
                element: <RegisterPage />,
            },
            {
                path: '/dashboard',
                element: <DashboardPage />,
            },
            {
                path: '/search',
                element: <SearchPage />,
            }
        ]
    }
]);

function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
