import { useState } from 'react'
import { Search } from './components/Search'

export const App = () => {
  // Main application component
  // This is where the main layout and components are defined
  // It includes a header with an image and a title, and the Search component
  // The Search component is imported from the components directory

  const[searchTerm, setSearchTerm] = useState('');
  return (
    <main>


        <div className='pattern'>

            <div className='wrapper'>
                <header>
                  <img src='/public/hero-img.png' alt='hero-bg' />
                  <h1> Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
                </header>
            </div>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <h1 className="text-white"> {searchTerm}</h1>
        </div>
    </main>
  )
}


export default App