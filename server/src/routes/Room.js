import React from "react";
import { useParams } from "react-router-dom";

const Room = () => {
    const params = useParams;
    return <div>Music Room: params</div>;
};

export default Room;
