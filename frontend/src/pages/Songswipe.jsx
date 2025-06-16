import React from 'react'
import {Link} from "react-router";




const Songswipe = () => {
    return (
        <div>
            <div className=" w-2/6 mt-4 justify-self-center space-y-3">
                <p className="mb-5 text-l text-center">
                    Enter the Song name and Artist. <br/> We will recommend you songs that match the vibe and similar to the song.
                </p>
                <label className="input input-bordered flex items-center gap-2">
                    Song Name
                    <input type="text" className="grow" placeholder="Midnight Drive"/>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    Artist
                    <input type="text" className="grow"/>
                </label>
                {/*<button className="btn btn-primary w-1/4 justify-self-center">Create</button>*/}


            </div>
        </div>
    );
}
export default Songswipe;