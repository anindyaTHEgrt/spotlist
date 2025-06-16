import React from 'react'
import Navbar from './Navbar.jsx'
import {Link} from 'react-router'
import Songswipe from '../pages/Songswipe.jsx'


const MakePlaylist = () => {

    return (
        <div>
            <div className=" w-3/6 mt-4 justify-self-center space-y-3">
                <p className="mb-5 text-2xl text-center">
                    This is where we create the foundation of your playlist! <br/>
                    Enter the name of your playlist and then tell us the vibe you are going for.
                </p>
                <label className="input input-bordered flex items-center gap-2">
                    Name
                    <input type="text" className="grow" placeholder="Midnight Drive"/>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    Vibe
                    <input type="text" className="grow"/>
                </label>
                <Link to={"/songswipe"}>
                    <button className="btn btn-primary w-1/4 justify-self-center">Create</button>
                </Link>

            </div>
        </div>
    )
}

export default MakePlaylist