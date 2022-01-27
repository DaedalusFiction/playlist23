import React from "react";
import { Outlet } from "react-router-dom";

const Rooms = () => {
    return (
        <>
            <h2>Rooms</h2>
            <Outlet />
        </>
    );
};

export default Rooms;
