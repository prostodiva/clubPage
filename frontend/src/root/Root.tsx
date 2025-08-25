/**
 * Root layout component that provides the main application structure
 * 
 * This component serves as the root layout wrapper for the entire application.
 * It renders a consistent header and footer across all pages while using
 * React Router's Outlet to render the dynamic page content in between.
 * 
 * @module root/Root
 * @author Margarita Kattsyna
 * @since 1.0.0
 */

import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header.tsx';

/**
 * Root component that establishes the main application layout
 * 
 * The Root component provides the foundational structure for the application
 * by rendering:
 * - A consistent Header component at the top
 * - Dynamic page content via React Router's Outlet
 * - A consistent Footer component at the bottom
 * 
 * This layout ensures that all pages maintain consistent navigation and
 * branding while allowing individual page content to be dynamically rendered
 * in the middle section.
 * 
 * @example
 * ```tsx
 * <Route path="/" element={<Root />}>
 *   <Route index element={<HomePage />} />
 *   <Route path="dashboard" element={<DashboardPage />} />
 *   <Route path="search" element={<SearchPage />} />
 * </Route>
 * ```
 * 
 * @returns {JSX.Element} The root layout component with header, content area, and footer
 * 
 * @see {@link Header} - Header component for navigation and branding
 * @see {@link Footer} - Footer component for additional links and information
 * @see {@link Outlet} - React Router component for rendering nested routes
 */
function Root() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Root;
