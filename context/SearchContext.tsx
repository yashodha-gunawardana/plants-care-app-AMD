import { createContext, useContext, useState } from "react";


// define search contect
type SearchContextType = {
    searchQuery: string; // store current search text
    setSearchQuery: (query: string) => void;  // update the search text
}


const SearchContext = createContext<SearchContextType | undefined>(undefined);


export const SearchProvider = ({ children }: { children: React.ReactNode }) => {

    // holds the search text
    const [searchQuery, setSearchQuery] = useState("");

    return (

        // makes searchQuery and setSearchQuery
            // available to all components inside this provider
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
};


// custome hook to access the search context
export const useSearch = () => {
    const context = useContext(SearchContext);
}