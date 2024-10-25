//import ws library to create a websocket server
const webSocket = require("ws");
//define the statrt class
class Start {
    //constructor accepts a port number for the websocket server
    constructor(port) {
        this.clients = [];   //initialises an array to hold connected clients
        this.ws = new webSocket.Server({ port });  //create a new websocket server on specified port
    }

    //method to start the websocket server
    startServer() {
        //set up an event listener for new connection
        this.ws.on("connection", (connection) => {

            let username = null;  //variable to store the username of the connected client

            console.log("New connection established."); //log when client connects

            //set up an event listener for incoming message from the client
            connection.on("message", (message) => {
                let parsedMsg;         //variable to hold the paresd message

                //attempt to parse the incoming message as json
                try {
                    parsedMsg = JSON.parse(message)
                } catch (error) {
                    //if parsing fails and username is  set ,broadcast the message
                    if (username) {
                        this.broadcast(`${username}: ${parsedMsg.broacast_msg}`, connection);
                    } else {
                        //if no username is set ,log a warning
                        console.log("Message received before username was set.");
                    }
                    return;
                }

                //check if the message contains a username setting
                if (parsedMsg.set_username) {
                    username = parsedMsg.set_username;  //set the username
                    this.clients.push({ connection, username });  //add the client to clients array
                    console.log(`Username set to ${username}`);   //log the set username
                    // console.log(`Client connected to: ${connection.url}`);
                    return;
                }

                // Handle private messages if recipient and message are provided
                if (parsedMsg.private_msg && parsedMsg.to) {
                    this.privateMsg(parsedMsg.to, `${username}: ${parsedMsg.private_msg}`);
                    return;
                }

                //if a broadcast message is recieved and the username is set, broadcast it to all clients
                if (username && parsedMsg.broadcast_msg) {
                    this.broadcast(`${username}: ${parsedMsg.broadcast_msg}`, connection);
                }


            })
        })

        console.log(`Broadcast server started on ws://localhost:${this.ws.options.port}`);

    }

    // Method to broadcast a message to all connected clients except the sender

    broadcast(message, sender) {
        this.clients.forEach((client) => {
            // Check if the client's connection is open and is not the sender

            if (client.connection !== sender && client.connection.readyState === webSocket.OPEN) {
                client.connection.send(`Broadcast message: ${message}`);    // Send the broadcast message
            }
        })
    }

    // Method to send a private message to a specific recipient

    privateMsg(recipientUsername, message) {

        const recipient = this.clients.find((client) => recipientUsername === client.username);
        if (recipient) {
            recipient.connection.send(`Private Message ${message}`);
        } else {
            console.log(`Recipient ${recipientUsername} not found or not connected.`);
        }

    };


}

// Export the Start class for use in other modules

module.exports = Start;