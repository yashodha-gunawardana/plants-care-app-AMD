import { createContext } from "react";


// define search contect
type SearchContextType = {
    searchQuery: string; // store current search text
    setSearchQuery: (query: string) => void;  // update the search text
}


const SearchContext = createContext<SearchContextType | undefined>(undefined);