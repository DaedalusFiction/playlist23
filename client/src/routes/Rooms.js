import React from "react";
import { Outlet } from "react-router-dom";

const Rooms = ({ username }) => {
    return (
        <>
            <h2>Rooms</h2>
            <Outlet username={username} />
        </>
    );
};

export default Rooms;
