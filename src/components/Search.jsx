import React from 'react'
import { useState } from 'react'


export const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
        <div>
            <img src="public/search.svg" alt="seatch" />

            <input 
            type="text" 
            placeholder="Search movie" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
    </div>
  )
}

export default Search