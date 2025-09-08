import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Notfound from './pages/Notfound'
import Person from './components/person/Person'
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="person" element={<Person />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
