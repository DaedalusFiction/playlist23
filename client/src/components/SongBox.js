import React from "react";

const SongBox = ({ song, onClick, index }) => {
    return (
        <div className="song-box">
            <div className="song-box-info">
                <p>{song.artist}</p>
            </div>
            <div className="song-box-content">
                <p>{song.title.replace(".mp3", "")}</p>
                <p id={index} onClick={onClick}>
                    play
                </p>
            </div>
        </div>
    );
};

export default SongBox;
