
import type { SearchResponse } from "../types/searchTypes";

export async function searchAll(term: string): Promise<SearchResponse> {
    const res = await fetch(`/search?term=${term}`);

    if (!res.ok) {
        throw new Error('Failed to search');
    }

    const data: SearchResponse = await res.json();
    return data;
}