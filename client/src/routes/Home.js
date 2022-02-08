import CreateRoomButton from "../components/CreateRoomButton";
import JoinRoomButton from "../components/JoinRoomButton";

const Home = () => {
    return (
        <>
            <div className="home">
                <div className="container">
                    <div className="home-left flex">
                        <div className="home-buttons">
                            <JoinRoomButton />
                            <p>or</p>
                            <CreateRoomButton />
                        </div>
                    </div>
                    <div className="home-right flex">
                        <div className="home-hero">
                            <p>a simple way to</p>
                            <p>share your</p>
                            <p>music</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Home;
