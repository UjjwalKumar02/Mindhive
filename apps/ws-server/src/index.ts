import { WebSocketServer } from "ws";
import type WebSocket from "ws";
import { validateToken } from "./utils/validateToken.js";

const server = new WebSocketServer({ port: 3006 });

// Websocket singleton
interface User {
  userId: string;
  rooms: string[];
  socket: WebSocket;
}
let usersDB: User[] = [];

// Connection Handling
server.on("connection", (socket, req) => {
  socket.send("Welcome!");

  // Validate user
  const url = req.url;
  if (!url) {
    socket.close();
    return;
  }

  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) {
    socket.close();
    return;
  }

  const userId = validateToken(token);
  if (userId == null) {
    socket.close();
    return;
  }

  usersDB.push({ userId, rooms: [], socket: socket });

  // Message handling
  socket.on("message", (req) => {
    const parsedData = JSON.parse(req.toString());

    // Join room
    if (parsedData.type == "join_room") {
      const user = usersDB.find((u) => u.socket === socket);
      if (!user) {
        return;
      }

      user.rooms.push(parsedData.roomId);
      socket.send("Room joined!");
    }

    // leave room
    if (parsedData.type == "leave_room") {
      const user = usersDB.find((u) => u.socket === socket);
      if (!user) {
        return;
      }
      user.rooms = user.rooms.filter((r) => r !== parsedData.roomId);
      socket.send("Left room!");
    }

    // Chat message
    if (parsedData.type == "chat") {
      const users = usersDB.filter((u) => u.rooms.includes(parsedData.roomId));

      users.map((u) => {
        u.socket.send(parsedData.chat);
      });
    }
  });
});
