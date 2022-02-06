import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="header">
            <div className="container">
                <div>
                    <Link to="/">playlist: 23</Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/joinRoom">join a room</Link>
                        </li>
                        <li>
                            <Link to="/createRoom">create a room</Link>
                        </li>
                        <li>
                            <Link to="/about">about</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
