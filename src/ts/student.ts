import { get } from 'node:http';
import path from 'node:path';
import { workerData } from 'node:worker_threads';
import * as vscode from 'vscode';
import { WebSocket } from 'ws';
import fs from 'node:fs';
import { Readable } from 'node:stream';

export function studentView(
  context: vscode.ExtensionContext,
  clientData: object
) {
  const files: Array<string> = [];
  let fileName: any;
  const diskFileName: any = context.workspaceState.get('file-name');

  // const ws = new WebSocket(`ws://${clientData.code}:3000/`);
 const ws = new WebSocket(`ws://192.168.234.68:3000/`);
  //const ws = new WebSocket(`ws://192.168.234.134:3000/`);
  // const ws = new WebSocket(`ws://172.20.10.8:3000/`);
 // const ws = new WebSocket(`ws://172.20.10.2:3000/`);
  ws.on('open', function open() {
    console.log('Connected to server');
    const data = clientData;
    console.log(data);
    const data1 = new TextEncoder().encode(
      JSON.stringify({ data: data, type: 'clientDetails' })
    );
    ws.send(data1);
  });

  ws.on('message', function incoming(data: any) {
    const rec = JSON.parse(new TextDecoder().decode(data));
    console.log('Received from server:', rec);
    if (rec.files) {
      console.log(rec.files);

      const getWorskpace = vscode.workspace.workspaceFolders;
      if (getWorskpace) {
        const folderUri = getWorskpace[0].uri;
        console.log(folderUri);
        rec.files?.forEach((ele: string) => {
          const filePath = path.join(folderUri.path, ele);
          console.log(filePath);
          let sampleData = new TextEncoder().encode('');
          vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), sampleData);
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

  const onDiskPathForTextFiles = vscode.Uri.file(
    path.join(context.extensionPath, 'src', 'files')
  );
  vscode.workspace.fs.createDirectory(onDiskPathForTextFiles);

  vscode.window.onDidChangeActiveTextEditor((e) => {
    if (e) {
      // handle file base name extraction based on the platform (Windows or POSIX)
      fileName = path.basename(e.document.fileName);
      context.workspaceState.update('file-name', fileName);
      vscode.Uri.joinPath(onDiskPathForTextFiles, fileName);
      // context.workspaceState.update('filename', fileName)
    }
  });

  vscode.workspace.onDidChangeTextDocument((e) => {
    console.log('insdie the ', fileName);
    try {
      const encodedDataToUInt8Array = new TextEncoder().encode(
        e.document.getText()
      );
      if (
        e.document.uri.scheme === 'file' &&
        e.document.uri.fsPath ===
          vscode.window.activeTextEditor?.document.uri.fsPath
      ) {
        const filePath = path.join(
          context.extensionPath,
          'src',
          'files',
          fileName
        );

        vscode.workspace.fs.writeFile(
          vscode.Uri.file(filePath),
          encodedDataToUInt8Array
        );

        // const fileList = vscode.workspace.fs.readDirectory(vscode.Uri.file(path.join(context.extensionPath, 'src', 'files'))).then(e => e)
        // console.log("fileList",fileList.then(e => console.log(e)))
        const userFiles: any = {};
        // const directoryPath = path.join(context.extensionPath, 'src', 'files');

        // function readFileAsStream(filePath: fs.PathLike, fileName: string) {
        //   return new Promise<void>((resolve, reject) => {
        //     let fileContent = '';

        //     const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

        //     readStream.on('data', chunk => {
        //       fileContent += chunk;
        //     });

        //     readStream.on('end', () => {
        //       userFiles[fileName] = fileContent;
        //       resolve();
        //     });

        //     readStream.on('error', err => {
        //       console.error(`Failed to read file ${fileName}:`, err);
        //       reject(err);
        //     });
        //   });
        // }

        // fs.readdir(directoryPath, (err, files) => {
        //   if (err) {
        //     console.error('Failed to read directory:', err);
        //     return;
        //   }

        //   const fileReadPromises : any = files.map(fileName => {
        //     const filePath = path.join(directoryPath, fileName);
        //     return readFileAsStream(filePath, fileName);
        //   });

        //   Promise.all(fileReadPromises)
        //     .then(() => {
        //       const encodeFilesData = new TextEncoder().encode(JSON.stringify(userFiles))
        //       ws.send(encodeFilesData)

        //     })
        //     .catch(err => {
        //       console.error('Error processing files:', err);
        //     });

        // });

        // ws.send(encodedDataToUInt8Array)
        // console.log("sent")
        const fileList = vscode.workspace.fs
          .readDirectory(
            vscode.Uri.file(path.join(context.extensionPath, 'src', 'files'))
          )
          .then((e: any) => {
            // const encodedArray   = new TextEncoder().encode(e)
            // ws.send(encodedArray)
            e.forEach((ele: any, i: number) => {
              const [fileName] = ele;

              const filePath = vscode.Uri.file(
                path.join(context.extensionPath, 'src', 'files', fileName)
              );
              vscode.workspace.fs.readFile(filePath).then((text) => {
                const decodedData = new TextDecoder().decode(text);

                userFiles[fileName] = decodedData;
                const encodeFilesData = new TextEncoder().encode(
                  JSON.stringify({ userFiles: userFiles, type: 'files' })
                );
                ws.send(encodeFilesData);
              });
            });
          });
        //console.log(userFiles)
        // console.log("fileList", fileList.then(e => console.log(e)))
        if (ws.readyState === WebSocket.OPEN) {
        } else {
          console.error('WebSocket is not open. Current state:', ws.readyState);
        }
      }
    } catch (err) {
      console.log('Error sending document ', err);
    }
    // vscode.window.onDidChangeActiveTextEditor(e => {

    // })
  });

  // const watcher = vscode.workspace.createFileSystemWatcher(
  //   new vscode.RelativePattern(
  //     path.join(context.extensionPath, 'src', 'files'),
  //     '**/*'
  //   )
  // );
}
