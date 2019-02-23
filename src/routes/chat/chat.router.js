var ioo = require("socket.io");
//  import { ChatHandler } from './chat.handler';
const ChatHandler = require('./chat.handler').default;
 module.exports = async function(server) {
    const io = ioo(server);
    io.on('connection', client => {  
      client.on('group', async (data) => {
         let group = await ChatHandler.createGroups(data);
        if(group.status == 1) {
          client.emit("success", group);
          client.join(data.groupId);
        }else {
          client.emit("error", group);
        }
          io.to(data.groupId).emit({message:'new user joined'});
          let messages =  await ChatHandler.list(data);
          io.to(data.groupId).emit("message", messages);
        })
        client.on('message', async (data) => {
          let messages =  await ChatHandler.list(data);
          io.to(data.groupId).emit("message", messages);
        })  
        client.on('createmessage', async (data) => {
            let message = await ChatHandler.createMessage(data);
          if(message.status == 1) {
            client.emit("success", message);
            let messages =  await ChatHandler.list(data); 
            io.to(data.groupId).emit("message", messages);
          }else {
            client.emit("error", message);
          }
         });
        client.on('disconnect', () => { /* … */ });
      });
}