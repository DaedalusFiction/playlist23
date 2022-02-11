import io from "socket.io-client";
const ENDPOINT = "http://localhost:4001";
const socket = io(ENDPOINT);
export { socket };
