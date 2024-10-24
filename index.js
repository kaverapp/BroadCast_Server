const webSocket = require("ws");

class Start{
    constructor(port){
        this.clients=[];
        this.ws=new webSocket.Server({port});
    }

    startServer(){
        
        this.ws.on("connection",(connection)=>{
            
            let username=null;

            console.log("New connection established.");
            
            connection.on("message",(message)=>{
                let parsedMsg;
                try {
                    parsedMsg=JSON.parse(message)
                } catch (error) {
                    if (username) {
                        this.broadcast(`${username}: ${message}`, connection);
                    } else {
                        console.log("Message received before username was set.");
                    }
                    return;
                }
                if (parsedMsg.set_username) {
                    username = parsedMsg.set_username;
                    this.clients.push({ connection, username });
                    console.log(`Username set to ${username}`);
                    return;
                }

              

            })
        })
        
        console.log(`Broadcast server started on ws://localhost:${this.ws.options.port}`);

    }
    broadcast(message,sender){
        this.clients.forEach((client)=>{
         if(client.connection!==sender && client.connection.readyState===webSocket.OPEN){
            client.connection.send(`Broadcast message: ${message}`);
        }
        })
    }

   
}








module.exports=Start;