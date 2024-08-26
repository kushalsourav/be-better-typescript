
import path from 'path';
import * as vscode from 'vscode';
import { WebSocket, WebSocketServer, Server } from 'ws';
import http from 'node:http'
import { get } from 'http';
import { stat } from 'fs';
import { teacherView } from './ts/teacher';
import { studentView } from './ts/student';

//golbal variable 

// function createState(initialValue: any) {
// 	let value = initialValue;
// 	const listeners: any[] = [];

// 	return {
// 		getValue: () => value,
// 		setValue: (newValue: any) => {
// 			value = newValue;
// 			listeners.forEach(callback => callback(value));
// 		},
// 		subscribe: (callback: any) => {
// 			listeners.push(callback);
// 		}
// 	};
// }

// // const getRole = (role: string) => {
// // 	return new Promise((resolve , reject) => {
// //          const success = true;
// // 		 setTimeout(() => {
// // 			if(success) {
// // 				const data = role;
// // 				resolve(data);
// // 			} else {
// // 				reject("data not fetched");
// // 			}
// // 		 }, 2000);
// // 	})
// // }

// const teacher = () => {
// 	// const hostname = '192.168.157.1';
// 	// const port = 3000;

// 	// const server = http.createServer((req, res) => {
// 	// 	res.statusCode = 200;
// 	// 	res.setHeader('Content-Type', 'text/plain');
// 	// 	res.end('Hello, World!\n');
// 	// });

// 	// server.listen(port, hostname, () => {
// 	// 	console.log(`Server running at http://${hostname}:${port}/`);
// 	// });
// 	// const FileSchema = {
// 	// 	code: '', //code to join
// 	// 	files: [], //to be sent to students 
// 	// 	group: [], // contains the details of users who hav joined and files and ws connection is shared among the users in the array
// 	// 	connectionString: '', // a string is sent to user to establish peer to peer connection 

// 	// }
// 	let clients: any = [];
// 	const wss = new WebSocketServer({ host: '192.168.42.68', port: 3000 });
// 	wss.on('connection', function connection(ws) {
// 		console.log('Client connected');
       
// 		// Create a new client object and add it to the clients array
// 		const clientObj = {
// 			ws: ws,
// 			id: '',
// 			messages: []
// 		};
// 		clients.push(clientObj);
// 		console.log(clients)



// 		// Handle incoming messages
// 		const filesArray = ['script.js', 'index.html', 'styles.css']
// 		ws.send(JSON.stringify({files :filesArray}))





// 		ws.on('message', function message(data: any) {






// 			const newData = JSON.parse(new TextDecoder().decode(data));

// 			console.log('Received from client:', newData);
		

// 			// Find the client object that corresponds to this WebSocket connection
// 			const client = clients.find((client: { ws: import("ws"); }) => client.ws === ws);

// 			if (client) {

				
// 				console.log(`Message stored for client ${client.id}:`, client.messages);
// 			} else {
// 				console.error('Client not found for this message.');
// 			}
// 		});

// 		// Handle errors
// 		ws.on('error', (error: any) => {
// 			console.error('WebSocket error:', error);
// 		});

// 		// Handle client disconnection
// 		ws.on('close', () => {
// 			console.log('Client disconnected');

// 		});

// 		// Send a welcome message to the client
// 		const welcomeMessage = JSON.stringify({ message: "Welcome to the server!", id: clientObj.id });
// 		ws.send(welcomeMessage);

// 	});
// 	console.log(clients)
// }


export function activate(context: vscode.ExtensionContext) {
	let newWelcomeView;
	let data = "hh"

	console.log('Congratulations, your extension "be-better-typescript" is now active!');
	// const wss = new WebSocketServer({ port: 8080 });
	//teacherView()
	// wss.on('connection', function connection(ws) {
	//   ws.on('error', console.error);
	//  console.log("conntection established")
	//   ws.on('message', function message(data) {
	// 	console.log('received: %s', data);
	//   });

	//   ws.send('something');
	// });
	// const server = new Server({port: 8080})

	// server.on('connection', (e)=> {
	// 	console.log("connection established")

	// 	e.on('message', msg=> {
	// 		console.log(msg)
	// 	})
	// 	e.on('close', (code, reason) => {
	// 		console.log(`connection closed with code ${code} and reason ${reason}`)
	// 	  })
	// })


	//   const welcomeSidebar = vscode.commands.registerCommand('be-better-typescript.welcomeSidebar', () => {
	//     vscode.commands.executeCommand('workbench.view.explorer').then(() => {
	//         vscode.commands.executeCommand('workbench.action.closeSidebar');
	//         vscode.commands.executeCommand('workbench.view.extension.primary-sidebar');
	//     });
	//    });

	// vscode.commands.executeCommand('workbench.view.explorer').then(() => {
	//     vscode.commands.executeCommand('workbench.action.closeSidebar');
	//     vscode.commands.executeCommand('workbench.view.extension.primary-sidebar');
	// });

	// context.subscriptions.push(welcomeSidebar);


	const disposable = vscode.commands.registerCommand('be-better-typescript.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from be-better-teecript');
	});

	function getData(dat: string) {
		const code = context.workspaceState.get('code');
		const regno = context.workspaceState.get('regno');
		const username = context.workspaceState.get('username');
		const files = context.workspaceState.get('files');

		const clientData : object = {
           name: username,
		   code: code,
		   regno: regno
		}
		switchRoles(dat, clientData, files)
		console.log(data)
	}






	newWelcomeView = new myWebViewProvider(context, getData)

	vscode.window.registerWebviewViewProvider('welcome-view', newWelcomeView)



	context.subscriptions.push(disposable);

	const switchRoles = (role: string, clientData: object, files: any) => {
        const file: [] = JSON.parse(files)
		console.log(role)
		switch (role) {
			case 'student':
				console.log('joining')
				studentView(context,clientData)
				break;
			case 'teacher':
				console.log('creating')
				console.log(file)
                 teacherView(file)
				
				break;
			default:
				break;
		}





	}

}




class myWebViewProvider implements vscode.WebviewViewProvider {
	data: any;
	getData: any;
	welcomeView: any;
	// userData : object = {
    //   regno: '',
	//   name: '',
	//   code: ''
	// }
	constructor(private context: vscode.ExtensionContext, getData: any) {
		this.getData = getData
		this.data = 'welcome'
	}

	resolveWebviewView(webviewView: vscode.WebviewView) {
		let view;
		webviewView.webview.options = {
			enableScripts: true,

		}


		const scriptPath = vscode.Uri.file(path.join(this.context.extensionPath, 'src', 'js', 'script.js'))
		const scriptUri = webviewView.webview.asWebviewUri(scriptPath)
		const cssPath = vscode.Uri.file(path.join(this.context.extensionPath, 'src', 'css', 'styles.css'))
		const cssUri = webviewView.webview.asWebviewUri(cssPath)


		webviewView.webview.html = `
	<link rel="stylesheet" href="${cssUri}" />
<section id="main">
	<h1> Welcome </h1>
	<button class="cta-btn" is="create-button"> </button>
    <span class="welcome-span">or</span>
	<button class="cta-btn" is="join-button" > </button>		 
	</div>

	<script type="module" src=${scriptUri}></script>
	`

		webviewView.webview.onDidReceiveMessage(message => {
			const userData = {
				name: '',
				regno: '',
				code: ''
			}
			if(message.name) {
				this.context.workspaceState.update('username', message.name);
			}

			if(message.regno) {
				this.context.workspaceState.update('regno', message.regno);
			}
			if(message.code) {
				this.context.workspaceState.update('code', message.code);
			}
           
			if (message.command === 'role') {
				console.log(message.command)
				this.data = message.role
				
				vscode.window.showErrorMessage(message.role)
				if (message.role === 'create') {
					console.log(message.role)
					webviewView.webview.html = `
					<link rel="stylesheet" href="${cssUri}" />
					<section id="main">
						<input type="text" class="create-title-input" placeholder="enter code here" />
						<br />
						<br />
						<input type="text" class="create-file-input" placeholder="enter file name" />
						<button class="add-button cta-btn">Add Files</button>
						<div class="files-view">

							<template class="template-files-list">

								<ul class="files-list">

								</ul>

							</template>
						</div>
						<button is="create-test-button" class="create-button cta-btn">create</button>
					</section>

					<script type="module" src=${scriptUri}></script>
				`
				}
				if (message.role === 'join') {
				
					webviewView.webview.html = `
					<link rel="stylesheet" href="${cssUri}" />
					<section id="main">
						<input type="text" class="enter-title-input input-code" placeholder="enter code here" />
						<input type="text" class="enter-title-input input-regno" placeholder="register num" />
						<input type="text" class="enter-title-input input-name" placeholder="name" />
						<button is="join-code-button" class="join-code-button cta-btn"></button>
					</section>
					<script type="module" src=${scriptUri}></script>
				`
				}
			}

			if (message.switch === 'teacher') {
				this.context.workspaceState.update('files', message.files);
				this.getData(message.switch)
			}
			if (message.switch === 'student') {
				this.getData(message.switch)
			}


		})

		console.log(view)
	}

	updateData(value: string) {
		this.data = value
	}
	showData() {
		return this.data
	}
}



export function deactivate() { }


