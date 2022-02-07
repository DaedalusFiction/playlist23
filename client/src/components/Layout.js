import React from "react";
import { Outlet } from "react-router-dom";
import Bubbles from "./Bubbles";

import Header from "./Header";

const Layout = () => {
    return (
        <>
            <main>
                <Header />
                <Bubbles />
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
