import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from './root/Root.tsx'
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage.tsx";

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
