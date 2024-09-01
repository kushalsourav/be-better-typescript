import path, { parse } from 'path';
import * as vscode from 'vscode';
import fs from 'node:fs';
import { WebSocketServer } from 'ws';
import EventEmitter from 'node:events';
import * as dgram from 'node:dgram';
import * as os from 'node:os';

function getLocalIpAddress(): string | null {
  console.log('TRYING.... dynamic ws');

  const networkInterfaces = os.networkInterfaces();
  console.log(networkInterfaces);

  for (const interfaceName in networkInterfaces) {
    const interfaceInfo = networkInterfaces[interfaceName];

    if (interfaceInfo) {
      for (const details of interfaceInfo) {
        if (details.family === 'IPv4' && !details.internal && details.address) {
          // Return the first non-internal IPv4 address found
          return details.address;
        }
      }
    }
  }

  // Return null if no suitable IPv4 address is found
  return null;
}

export function teacherView(context: vscode.ExtensionContext, files: any) {
  const host = getLocalIpAddress();
  console.log('from teacher view');

  /**
   * TODO: get an available port dynamically
   * before broadcasting
   */
  const port = 3000;
  const udpPort = 12345;
  const broadcastAddress = '255.255.255.255';
  const udpSocket = dgram.createSocket('udp4');
  console.log('DYNAMIC...', host);
  // console.debug(host);

  if (host) {
    // Use the obtained IP address to set up the WebSocket server
    console.log(`WebSocketServer is running at ws://${host}:${port}`);
    const message = Buffer.from(`${host}:${port}`);
    // const message = Buffer.from('ws://192.168.1.5:3000');
    udpSocket.bind(() => {
      udpSocket.setBroadcast(true);

      setInterval(() => {
        udpSocket.send(
          message,
          0,
          message.length,
          udpPort,
          broadcastAddress,
          () => {
            console.log('Broadcasted WebSocket server address');
          }
        );
      }, 1000); // Broadcast every 1 seconds
    });

    /**
     * This .bind() can throw
     * TODO: exception handling
     */

    let clients: any = [];
    const teacherWebview = vscode.window.createWebviewPanel(
      'teacher-view',
      'teacher-view',
      { viewColumn: 1 },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    const cssUri = vscode.Uri.file(
      path.join(context.extensionPath, 'src', 'css', 'styles.css')
    );
    const cssPath = teacherWebview.webview.asWebviewUri(cssUri);

    const scriptUri = vscode.Uri.file(
      path.join(context.extensionPath, 'src', 'js', 'teacher.js')
    );
    const scriptPath = teacherWebview.webview.asWebviewUri(scriptUri);

    const onDiskHtmlPath = path.join(
      context.extensionPath,
      'src',
      'html',
      'index.html'
    );

    let htmlFile = fs.readFileSync(onDiskHtmlPath, 'utf-8');

    htmlFile = htmlFile
      .replace(
        `<script type="module" src="../js/teacher.js"></script> `,
        `<script type="module" src="${scriptPath}" ></script>`
      )
      .replace(
        '<link rel="stylesheet" href="../css/styles.css">',
        `<link rel="stylesheet" href="${cssPath}">`
      );
    console.log(htmlFile, typeof htmlFile);
    teacherWebview.webview.html = htmlFile;

    class MyEmitter extends EventEmitter {}

    //const ws = new WebSocket(`ws://192.168.234.134:3000/`);
    //const wss = new WebSocketServer({ host: '192.168.234.123', port: 3000 });
    // const wss = new WebSocketServer({ host: '192.168.234.68', port: 3000 });
    //const wss = new WebSocketServer({ host: '172.20.10.8', port: 3000 });
    // const wss = new WebSocketServer({ host: '172.20.10.2', port: 3000 });
    const wss = new WebSocketServer({ host: host, port: port });
    wss.on('connection', function connection(ws) {
      console.log('created connecteion');
      console.log('Client connected');

      const clientObj = {
        ws: ws,
        id: '',
        files: [],
      };
      clients.push(clientObj);

      const filesArray = ['script.js', 'style.css', 'index.html'];
      ws.send(JSON.stringify({ files: filesArray }));

      // ws.on('message', function message(data: any) {

      // 	const newData = new TextDecoder().decode(data);
      // 	teacherWebview.webview.postMessage({
      // 		command: 'client',
      // 		client: JSON.stringify(newData)
      // 	})

      // 	const client = clients.find((client: { ws: import("ws"); }) => client.ws === ws);

      // 	if (client) {
      // 		const parsedData = JSON.parse(newData)

      // 		clientObj.files = parsedData
      // 		teacherWebview.webview.postMessage({
      // 			command: 'client',
      // 			client: JSON.stringify("hello")
      // 		})

      // 		console.log(`Message stored for client ${client.id}:`, clientObj);

      // 	} else {
      // 		console.error('Client not found for this message.');
      // 	}

      // });
      ws.on('message', function message(data: any) {
        try {
          const newData = new TextDecoder().decode(data);
          const parsedData = JSON.parse(newData);

          // teacherWebview.webview.postMessage({
          // 	command: 'client',
          // 	client: JSON.stringify({hello : 'hello'}) // Ensure the data is correctly serialized
          // });

          const client = clients.find(
            (client: { ws: import('ws') }) => client.ws === ws
          );

          if (client) {
            if (parsedData.type === 'clientDetails') {
              client.id = parsedData.data.regno;
              client.code = parsedData.data.code;
              client.name = parsedData.data.name;
            }
            if (parsedData.type === 'files') {
              client.files = parsedData.userFiles;
            }
            if (teacherWebview && teacherWebview.webview) {
              teacherWebview.webview.postMessage({
                command: 'client',
                client: JSON.stringify(clients),
              });
              console.log('Message sent to webview');
            } else {
              console.error('Webview is not ready');
            }
          } else {
            console.error('Client not found for this message.');
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      });

      ws.on('error', (error: any) => {
        console.error('WebSocket error:', error);
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });

      const welcomeMessage = JSON.stringify({
        message: 'Welcome to the server!',
        id: clientObj.id,
      });
      ws.send(welcomeMessage);
    });
  } else {
    console.error(
      'No suitable network interface found. Cannot start WebSocketServer.'
    );
  }
}
