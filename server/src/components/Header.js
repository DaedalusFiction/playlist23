import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="header">
            <div className="container">
                <div>
                    <Link to="/">Playlist: 23</Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/joinRoom">Join a Room</Link>
                        </li>
                        <li>
                            <Link to="/createRoom">Create a Room</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
