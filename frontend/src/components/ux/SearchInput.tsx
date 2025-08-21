/**
 * Search input component for the application header
 * A search input field with search icon that allows users to search and navigate to results
 * @module components/ux/SearchInput
 * @author Margarita Kattsyna
 */

import { useState } from 'react';
import { VscSearch } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

/**
 * Search input component that allows users to search and navigate to results
 * A search input field with a search icon that navigates to search results page
 * @returns Search input form with icon and navigation functionality
 * @example
 * ```tsx
 * // Basic usage
 * <SearchInput />
 * 
 * // In header component
 * <div className="header">
 *   <SearchInput />
 * </div>
 * ```
 */
export default function SearchInput() {
    /** The current search term entered by the user */
    const [term, setTerm] = useState('');
    
    /** React Router navigation function */
    const navigate = useNavigate();

    /**
     * Handle form submission and navigate to search results
     * Prevents default form submission and navigates to search results page with the search term
     * @param event - The form submission event
     * @example
     * ```tsx
     * // This function is called automatically when form is submitted
     * // User types "users" and presses Enter
     * // Navigates to "/search?term=users"
     * ```
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/search?term=${term}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="relative">
                {/* Search Icon */}
                <div className="absolute inset-y-0 flex items-center pl-3">
                    <VscSearch className="h-5 w-5 text-gray-500" />
                </div>
                
                {/* Search Input Field */}
                <input
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                    className="pl-10 py-2 w-full border-0 shadow-none"
                    placeholder="Search"
                    aria-label="Search for clubs, users, or meetings"
                    title="Enter search term and press Enter"
                />
            </div>
        </form>
    );
}