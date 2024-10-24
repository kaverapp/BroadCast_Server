const Start=require("./index")
const webSocket = require("ws");
const readline=require("readline");

function startServerConnection(){
    const server=new Start(3000);
    server.startServer();
}



function connectAsClient(){
    const ws=new webSocket("ws://localhost:3000");
        ws.on("open",()=>{
            const rl= readline.createInterface({
                input:process.stdin,
                output:process.stdout
            })
           
            rl.question("enter ur username",(username)=>{
                ws.send(JSON.stringify({"set_username":username}))
            })

            rl.on("line",(line)=>{
                ws.send(line);
                console.log(`Sent message: ${line}`);
    
            });

            
            
        })
        ws.on("message",(message)=>{
            const msg=message.toString();
            console.log("message recieved",msg);
            
        })
        console.log("connected");
        
    }

const command=process.argv[2];

    switch (command){
        case "connect":
            connectAsClient();
            break;
        case "start":
            startServerConnection();
            break;
        default:
            console.log("invalid command");
            break;
    }
    
