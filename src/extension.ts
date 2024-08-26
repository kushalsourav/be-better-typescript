
import path from 'path';
import * as vscode from 'vscode';
import { WebSocket, WebSocketServer, Server } from 'ws';
import http from  'node:http'
import { get } from 'http';
import { stat } from 'fs';
import { teacherView, teacherWebViewProvider } from './ts/teacher';
import { studentView, studentWebViewProvider } from './ts/student';

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

const teacher = () => {
	const hostname = '192.168.157.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
}); 
const FileSchema = {
	code: '', //code to join
    files : [], //to be sent to students 
	group: [], // contains the details of users who hav joined and files and ws connection is shared among the users in the array
	connectionString: '', // a string is sent to user to establish peer to peer connection 

}
let clients: any = [];
const wss = new WebSocketServer({ host: '172.20.10.8', port: 3000 });
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Create a new client object and add it to the clients array
  const clientObj = {
    ws: ws,
    id: Date.now(), // Unique ID for the client, could use something else like UUID
    messages: []
  };
  clients.push(clientObj);
  console.log(clients)
  // Handle incoming messages
  ws.on('message', function message(data: any) {
    const newData = new TextDecoder().decode(data);
    console.log('Received from client:', newData);

    // Find the client object that corresponds to this WebSocket connection
    const client = clients.find(client => client.ws === ws);

    if (client) {

      client.messages.push(newData);
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


export function activate(context: vscode.ExtensionContext) {
	let newWelcomeView;
	let data = "hh"

	console.log('Congratulations, your extension "be-better-typescript" is now active!');
	// const wss = new WebSocketServer({ port: 8080 });
     teacher()
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
		switchRoles(dat)
		console.log(data)
	}






	newWelcomeView = new myWebViewProvider(context, getData)

	vscode.window.registerWebviewViewProvider('welcome-view', newWelcomeView)



	context.subscriptions.push(disposable);

	const switchRoles = (role: string) => {

		switch (role) {
		 case 'join':
			 console.log('joining')
              studentView()
			 break;
		 case 'teacher':
			 console.log('creating')
		
			 const webview = vscode.window.createWebviewPanel('webview', 'teacher-view', {viewColumn: 1}, {
				enableScripts: true
			 })
			 webview.webview.html = `
			 <html>
<body>
<h1>  teacher omg</h>
  <script>
    const ws = new WebSocket('ws://localhost:3000');
    ws.onopen = function() {
      console.log('Connected to server');
    };
    ws.onmessage = function(event) {
      console.log('Received message from server:', event.data);
    };
    ws.onerror = function(error) {
      console.error('WebSocket error:', error);
    };
    ws.onclose = function() {
      console.log('Disconnected from server');
    };
  </script>
</body>
</html>
			 `
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

			if (message.command === 'role') {
				this.data = message.role
                this.getData(message.role)
				vscode.window.showErrorMessage(message.role)
				if (message.role === 'create') {
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
			}

			if(message.switch === 'teacher') {
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

// class myViewProvider implements vscode.TreeDataProvider<myTree> {
//   constructor(private context : vscode.ExtensionContext) {}

//     getTreeItem(element: myTree): vscode.TreeItem  {
// 		return element
// 	}
// 	getChildren(element?: myTree): myTree[] {
// 		return [
// 			new myTree('label 1')

// 		]
// 	}
// }

// class myTree extends vscode.TreeItem {
// 	constructor(label: string) {
// 		super(label);
// 	}
// }
// This method is called when your extension is deactivated


export function deactivate() { }


