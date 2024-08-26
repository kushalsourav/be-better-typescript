import * as vscode from 'vscode';

export function teacherView (context : vscode.ExtensionContext) {
    console.log("from teacher view")

}

export class teacherWebViewProvider implements vscode.WebviewViewProvider {
    constructor(context : vscode.ExtensionContext) {

    }
    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts : true
        }


         webviewView.webview.html = `<h1> Teacher view</h2>`
    }
   
} 