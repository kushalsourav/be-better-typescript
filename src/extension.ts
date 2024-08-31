import path from 'path';
import * as vscode from 'vscode';
import { WebSocket, WebSocketServer, Server } from 'ws';
import http from 'node:http';
import { get } from 'http';
import { stat } from 'fs';
import { teacherView } from './ts/teacher';
import { studentView } from './ts/student';


export function activate(context: vscode.ExtensionContext) {
  let newWelcomeView;
  let data = 'hh';
  const file = ['index.js', 'style.css'];
  teacherView(context,file)
  console.log(
    'Congratulations, your extension "be-better-typescript" is now active!'
  );


  const disposable = vscode.commands.registerCommand(
    'be-better-typescript.helloWorld',
    () => {
      vscode.window.showInformationMessage(
        'Hello World from be-better-teecript'
      );
    }
  );

  function getData(dat: string) {
    const code = context.workspaceState.get('code');
    const regno = context.workspaceState.get('regno');
    const username = context.workspaceState.get('username');
    const files = context.workspaceState.get('files');

    const clientData: object = {
      name: username,
      code: code,
      regno: regno,
    };
    switchRoles(dat, clientData, files);
    console.log(data);
  }

  newWelcomeView = new myWebViewProvider(context, getData);

  vscode.window.registerWebviewViewProvider('welcome-view', newWelcomeView);

  context.subscriptions.push(disposable);

  const switchRoles = (role: string, clientData: object, files: any) => {
    const file: [] = files;
    console.log("fils from here",file);
    switch (role) {
      case 'student':
        console.log('joining');
        studentView(context, clientData);
        break;
      case 'teacher':
        console.log('creating');
        console.log(file);
        teacherView(context, file);

        break;
      default:
        break;
    }
  };
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
  constructor(
    private context: vscode.ExtensionContext,
    getData: any
  ) {
    this.getData = getData;
    this.data = 'welcome';
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    let view;
    webviewView.webview.options = {
      enableScripts: true,
    };

    const scriptPath = vscode.Uri.file(
      path.join(this.context.extensionPath, 'src', 'js', 'script.js')
    );
    const scriptUri = webviewView.webview.asWebviewUri(scriptPath);
    const cssPath = vscode.Uri.file(
      path.join(this.context.extensionPath, 'src', 'css', 'styles.css')
    );
    const cssUri = webviewView.webview.asWebviewUri(cssPath);

    webviewView.webview.html = `
	<link rel="stylesheet" href="${cssUri}" />
<section id="main">
	<h1> Welcome </h1>
	<button class="cta-btn" is="create-button"> </button>
    <span class="welcome-span">or</span>
	<button class="cta-btn" is="join-button" > </button>		 
	</div>

	<script type="module" src=${scriptUri}></script>
	`;

    webviewView.webview.onDidReceiveMessage((message) => {
      const userData = {
        name: '',
        regno: '',
        code: '',
      };
      if (message.name) {
        this.context.workspaceState.update('username', message.name);
      }

      if (message.regno) {
        this.context.workspaceState.update('regno', message.regno);
      }
      if (message.code) {
        this.context.workspaceState.update('code', message.code);
      }

      if (message.command === 'role') {
        console.log(message.command);
        this.data = message.role;

        vscode.window.showErrorMessage(message.role);
        if (message.role === 'create') {
          console.log(message.role);
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
				`;
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
				`;
        }
      }

      if (message.switch === 'teacher') {
		console.log("teacher",message.files)
        this.context.workspaceState.update('files', message.files);
        this.getData(message.switch);
      }
      if (message.switch === 'student') {
        this.getData(message.switch);
      }
    });

    console.log(view);
  }

  updateData(value: string) {
    this.data = value;
  }
  showData() {
    return this.data;
  }
}

export function deactivate() {}
