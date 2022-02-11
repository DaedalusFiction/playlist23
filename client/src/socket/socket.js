import io from "socket.io-client";

//initializes server-side socket to persist throughout all pages, so that only one connection is needed
const ENDPOINT = "http://localhost:4001";
const socket = io(ENDPOINT);

export { socket };
