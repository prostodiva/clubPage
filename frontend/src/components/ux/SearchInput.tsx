/**
 * @fileOverview Search input component for the application header
 * @description A search input field that allows users to search and navigate to results
 * @module components/ux/SearchInput
 * @author Margarita Kattsyna
 * @version 1.0.0
 * */

import { useState } from 'react';
import { VscSearch } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

/**
 * Search input component that allows users to search and navigate to results
 * @component SearchInput
 * @returns {JSX.Element} Search input form with icon and navigation functionality
 * @example
 * ```tsx
 * // Basic usage
 * <SearchInput />
 * */

export default function SearchInput() {
    /** @type {string} The current search term entered by the user */
    const [term, setTerm] = useState('');
    /** @type {Function} React Router navigation function  */
    const navigate = useNavigate();

    /**
     * Handle form submission and navigate to search results
     * @description Prevents default form submission and navigates to search results page with the search term
     * @param {React.FormEvent<HTMLFormElement>} event - The form submittion event
     * @fires navigation - Navigates to search results page
     * @example
     * ```tsx
     * this function is called automatically when form is submitted
     * user types "users" and presses Enter
     * navigates to "/search?term=users"
     * */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        navigate(`/search?term=${term}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="relative">
                <div className="absolute inset-y-0 flex items-center pl-3">
                    <VscSearch className="h-5 w-5 text-gray-500" />
                </div>
                <input
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                    className="pl-10 py-2 w-full border-0 shadow-none"
                    placeholder="Search"
                />
            </div>
        </form>
    );
}