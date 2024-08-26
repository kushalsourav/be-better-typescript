import * as vscode from 'vscode';
import { WebSocket } from 'ws';
export function studentView() {
 const ws = new WebSocket('ws://172.20.10.8:3000/');

ws.on('open', function open() {
  console.log('Connected to server');
  const data = {
    name: 'hello',
    myDetials: ''
  }
  const data1 = new TextEncoder().encode(JSON.stringify(data))
  ws.send(data1);
});

ws.on('message', function incoming(data:any) {
  const rec = new TextDecoder().decode(data)
  console.log('Received from server:', JSON.parse(rec));
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});

ws.on('close', function close() {
  console.log('Disconnected from server');
});
}

export class studentWebViewProvider implements vscode.WebviewViewProvider {
    constructor(context : vscode.ExtensionContext) {

    }
    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts : true
        }


         webviewView.webview.html = `<h1> sttudent view</h2>`
    }
   
} 