import { createContext, useState } from "react";


// define search contect
type SearchContextType = {
    searchQuery: string; // store current search text
    setSearchQuery: (query: string) => void;  // update the search text
}


const SearchContext = createContext<SearchContextType | undefined>(undefined);


export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState("");
}