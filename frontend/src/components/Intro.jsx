import React, { useEffect, useState } from 'react';

const Intro = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem('hasSeenIntroPopup');
        if (!hasSeenPopup) {
            setShowPopup(true);
            localStorage.setItem('hasSeenIntroPopup', 'true');
        }
    }, []);

    const handleClose = () => {
        setShowPopup(false);
    };

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Welcome to SpotList 🎧</h2>
                        <p className="mb-4">
                            Swipe right 👍 to like a song, left 👎 to skip, and up ⭐ to add to your playlist!
                            Your preferences will help us recommend better songs to you!.
                        </p>
                        <button
                            onClick={handleClose}
                            className="btn btn-success w-full"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Intro;
