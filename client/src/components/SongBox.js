import React from "react";

const SongBox = ({ song, onClick, index }) => {
    return (
        <div className="song-box" onClick={onClick} id={index}>
            <div className="song-box-info">
                <p>{song.artist}</p>
            </div>
            <div className="song-box-content">
                <p>{song.title.replace(".mp3", "")}</p>
            </div>
            <div
                className="song-box-overlay"
                onClick={onClick}
                id={index}
            ></div>
        </div>
    );
};

export default SongBox;
