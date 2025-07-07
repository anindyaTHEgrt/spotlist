import React, {useRef} from 'react'
import Navbar from '../components/Navbar'
import {Link} from 'react-router'

import MakePlaylist from "../components/MakePlaylist.jsx";
import Hp_bg from "../media_assets/hp_bg.jpeg"


const HomePage = () => {

    const makeplaylistref = useRef(null);
    const ScrollToDiv = () =>{
        makeplaylistref.current?.scrollIntoView({behavior: "smooth"});
    };

  return (
      <div>
          <div
              className="hero w-full md:w-5/6 justify-self-center h-screen mt-7 rounded-md"
              style={{
                  backgroundImage: `url(${Hp_bg})`,
              }}>
              <div className="hero-overlay bg-opacity-60"></div>
              <div className="hero-content text-neutral-content text-center">
                  <div className="max-w-md">
                      <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                      <p className="mb-5">
                          Create your spotify playlist by just swiping left or right. We will understand your
                          taste and recommend you music accordingly.
                      </p>

                      <button className="btn btn-primary" onClick={ScrollToDiv}>Create Playlist!</button>

                  </div>
              </div>
          </div>
          <section ref={makeplaylistref} id="makeplaylist-section">
              <MakePlaylist/>
          </section>

      </div>
  )
}

export default HomePage