import React from "react";

const SongBox = ({ song }) => {
    return (
        <div className="song-box">
            <div className="song-box-info">
                <p>{song.artist}</p>
            </div>
            <div className="song-box-content">
                <p>
                    {song.title} - {song.duration}
                </p>
                <p>play</p>
            </div>
        </div>
    );
};

export default SongBox;
