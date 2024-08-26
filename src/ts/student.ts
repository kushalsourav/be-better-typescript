import { get } from 'node:http';
import path from 'node:path';
import * as vscode from 'vscode';
import { WebSocket } from 'ws';
export function studentView(context:vscode.ExtensionContext  ,clientData: object) {

const files: Array<string> = []




  // const ws = new WebSocket(`ws://${clientData.code}:3000/`);
  const ws = new WebSocket(`ws://170.20.10.8:3000/`);
  ws.on('open', function open() {
    console.log('Connected to server');
    const data = clientData
    console.log(data)
    const data1 = new TextEncoder().encode(JSON.stringify(data))
    ws.send(data1);
  });

  ws.on('message', function incoming(data: any) {
    const rec = JSON.parse(new TextDecoder().decode(data))
    console.log('Received from server:', rec);
    if(rec.files) {
        console.log(rec.files)
        
       const getWorskpace = vscode.workspace.workspaceFolders
       if(getWorskpace) {
        const folderUri = getWorskpace[0].uri
        console.log(folderUri)
        rec.files?.forEach((ele: string) => {
         const filePath = path.join(folderUri.path, ele)
         console.log(filePath)
         let sampleData =  new TextEncoder().encode('')
        vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), sampleData)
        });
       }
        
    }

  });

  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
  });

  ws.on('close', function close() {
    console.log('Disconnected from server');
  });


}



