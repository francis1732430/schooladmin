var ioo = require("socket.io");

 module.exports = function(server) {
    const io = ioo(server);
    io.on('connection', client => {  
      client.on('group', (data) => {
         console.log(data);
         client.join(data);
         io.to(data).emit('message','new user joined');
        })  
        client.on('message', data => { 
          io.to(data.group).emit("message", "message");
         });
        client.on('disconnect', () => { /* … */ });
      });
}