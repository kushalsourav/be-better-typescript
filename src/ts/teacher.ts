import * as vscode from 'vscode';
import { WebSocketServer } from 'ws';

export function teacherView (context : vscode.ExtensionContext, file : []) {
    console.log("from teacher view")

    let clients: any = [];
	const wss = new WebSocketServer({ host: '170.20.10.8', port: 3000 });
	wss.on('connection', function connection(ws) {
		console.log('Client connected');
       
		// Create a new client object and add it to the clients array
		const clientObj = {
			ws: ws,
			id: '',
			messages: []
		};
		clients.push(clientObj);
		console.log(clients, "files here :", file)



		// Handle incoming messages
	   
		ws.send(JSON.stringify({files :file}))





		ws.on('message', function message(data: any) {






			const newData = JSON.parse(new TextDecoder().decode(data));

			console.log('Received from client:', newData);
		

			// Find the client object that corresponds to this WebSocket connection
			const client = clients.find((client: { ws: import("ws"); }) => client.ws === ws);

			if (client) {

				
				console.log(`Message stored for client ${client.id}:`, client.messages);
			} else {
				console.error('Client not found for this message.');
			}
		});

		// Handle errors
		ws.on('error', (error: any) => {
			console.error('WebSocket error:', error);
		});

		// Handle client disconnection
		ws.on('close', () => {
			console.log('Client disconnected');

		});

		// Send a welcome message to the client
		const welcomeMessage = JSON.stringify({ message: "Welcome to the server!", id: clientObj.id });
		ws.send(welcomeMessage);

	});
	console.log(clients)

}

// export class teacherWebViewProvider implements vscode.WebviewViewProvider {
//     constructor(context : vscode.ExtensionContext) {

//     }
//     resolveWebviewView(webviewView: vscode.WebviewView) {
//         webviewView.webview.options = {
//             enableScripts : true
//         }


//          webviewView.webview.html = `<h1> Teacher view</h2>`
//     }
   
// } 