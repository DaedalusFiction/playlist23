const UsernameInput = ({ enterUsername }) => {
    return (
        <input
            type="text"
            onChange={enterUsername}
            placeholder="Enter Username"
        />
    );
};

export default UsernameInput;
