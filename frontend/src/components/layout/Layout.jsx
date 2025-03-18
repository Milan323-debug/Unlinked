import Navbar from "./Navbar.jsx"
import React from 'react';


const Layout = ({children}) => {

  return (<div className= 'min-h-screen bg-base-100'>
    <Navbar />
    <main className="max-w7x1 mx-auto px-4 py-6">
        {children}
    </main>
  </div>);
};

export default Layout;