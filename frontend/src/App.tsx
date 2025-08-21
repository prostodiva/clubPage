/**
 * @fileoverview Main application component with routing configuration
 * @description Sets up React Router with all application routes and pages
 * @module App
 * @author Margarita Kattsyna
 * @version 1.0.0
 */

import {createBrowserRouter, RouterProvider} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage.tsx";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MeetingsPage from "./pages/MeetingsPage.tsx";
import RegisterPage from "./pages/RegisterPage";
import { SearchPage } from "./pages/search/SearchPage.tsx";
import { searchLoader } from "./pages/search/searchLoader.ts";
import Root from './root/Root.tsx';
import {store} from "./store/store.ts";
import { Provider } from "react-redux";

/**
 * Main router configuration for the application
 * @description Defines all routes and their associated components/loaders
 * @type {import('react-router-dom').BrowserRouter}
 */
const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            { index: true, element: <HomePage /> },
            { path: '/events', element: <EventsPage /> },
            { path: '/meetings', element: <MeetingsPage /> },
            { path: '/login', element: <LoginPage /> },
            { path: '/register', element: <RegisterPage /> },
            { path: '/dashboard', element: <DashboardPage /> },
            { path: '/search', element: <SearchPage />, loader: searchLoader }
        ]
    }
]);

/**
 * Main App component that renders the router
 * @component App
 * @description Root component that initializes the application with routing
 * @returns {JSX.Element} The main application with router provider
 */
function App() {
  return (
    <div>
      <Provider store={store} >
          <RouterProvider router={router} />
      </Provider>
    </div>
  );
}

export default App;
