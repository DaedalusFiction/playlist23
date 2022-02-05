import React from "react";
import { Outlet } from "react-router-dom";

const Rooms = ({ username }) => {
    return (
        <>
            <Outlet username={username} />
        </>
    );
};

export default Rooms;
