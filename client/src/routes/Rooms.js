import React from "react";
import { Outlet } from "react-router-dom";

const Rooms = ({ joinedRooms, setJoinedRooms }) => {
    //props can be used to create box showing all joined rooms. Could be useful to quick navigation
    return (
        <>
            <Outlet />
        </>
    );
};

export default Rooms;
