let socketIO = require("socket.io");
const socketioJwt = require("socketio-jwt"); // JWT auth for socket.io
const { redisConfig, jwtsecret } = require("server/config/default"); // Secret eky for JWT
const socketEmitter = require("socket.io-emitter");
let socketRedis = require("socket.io-redis");

const socket = server => {
  let io = socketIO(server);

  // io.on("connection", () => {
  //   console.log("User connected");
  // });

  io.adapter(socketRedis(redisConfig));

  io.on(
    "connection",
    socketioJwt.authorize({
      secret: jwtsecret,
      timeout: 15000
    })
  );

  io.on("authenticated", function(socket) {
    const userId = socket.decoded_token.id;

    console.log(`User ${userId} connected!`);

    // Every user has it's own room by his userId
    socket.join(userId);

    // socket.emit("newToDo", {
    //   todo: [
    //     {
    //       name: "121",
    //       descr: "1212122"
    //     },
    //     {
    //       name: "3434",
    //       descr: "34343434"
    //     }
    //   ]
    // });

    socket.on("disconnect", function() {
      // io.to(userId).emit("signOut");

      // // Will disconnect all sockets with that userid
      // function disconnectRoom(room: string, namespace = "/") {
      //   io.of(namespace)
      //     .in(room)
      //     .clients((err, clients) => {
      //       clients.forEach(clientId =>
      //         this.io.sockets.connected[clientId].disconnect()
      //       );
      //     });
      // }

      console.log("user disconnected");
    });
  });
};

let redisClient;

if (process.env.REDISCLOUD_URL) {
  redisClient = require("redis").createClient(
    redisConfig.port,
    redisConfig.host,
    {
      no_ready_check: true,
      password: redisConfig.password
    }
  );
} else {
  redisClient = require("redis").createClient();
}

socket.emitter = socketEmitter(redisClient);

module.exports = socket;
