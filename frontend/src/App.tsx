/**
 * Main application component with routing configuration
 * Sets up React Router with all application routes and pages, configures Redux store provider
 * @module App
 * @author Margarita Kattsyna
 */

import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage.tsx";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MeetingsPage from "./pages/MeetingsPage.tsx";
import RegisterPage from "./pages/RegisterPage";
import { SearchPage } from "./pages/search/SearchPage.tsx";
import { searchLoader } from "./pages/search/searchLoader.ts";
import Root from './root/Root.tsx';
import { store } from "./store/store.ts";

/**
 * Main router configuration for the application
 * Defines all routes and their associated components/loaders using React Router v7
 * @see {@link Root} - The root layout component
 * @see {@link searchLoader} - Data loader for search functionality
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
 * Main App component that renders the router and Redux provider
 * Root component that initializes the application with routing and state management
 * @returns The main application wrapped with Redux provider and router
 * @see {@link Provider} - Redux store provider
 * @see {@link RouterProvider} - React Router provider
 * @see {@link store} - Redux store configuration
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
