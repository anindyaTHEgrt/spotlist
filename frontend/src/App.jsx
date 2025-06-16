import React from 'react'
import { Route, Routes } from 'react-router';


import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Songswipe  from "./pages/Songswipe.jsx";
import Callback from './pages/Callback';

const App = () => {
  // const handleLogin = () => {
  // const clientId = "YOUR_SPOTIFY_CLIENT_ID";
  // const redirectUri = "http://localhost:5173/callback";
  // const scope = "user-read-private user-read-email";
  //
  // const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
  // window.location.href = authUrl;
  // };

  return( 
  <div data-theme="forest">
    <Navbar/>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/songswipe' element={<Songswipe/>}/>
      <Route path='/callback' element={<Callback/>}/>
    </Routes>
    {/*<Footer/>*/}
  </div>
  );
};

export default App