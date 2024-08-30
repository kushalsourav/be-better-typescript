
import { ButtonCreate } from "../components/ButtonCreate.js";
import { ButtonJoin } from "../components/ButtonJoin.js";
import { DisplayAddedFiles } from "../components/DisplayAddedFiles.js";
import { ButtonTestCreate } from "../components/ButtonTestCreate.js";
import { ButtonCode } from "../components/ButtonCode.js";
//global variable

export const vscode = acquireVsCodeApi();

window.app = {}
let InitialDataTo = {
    role: [],
    files : [],
    fileName : ''

}


const proxyInitialData = new Proxy(InitialDataTo, {
    set: (target, property, value) => {
     
        if(property == 'files') {
            target[property].push(value);
            console.log("from here broo");
            window.dispatchEvent(new Event("filesupdated"))
        }
        if(property == 'fileName') {
            target[property] = value;
            window.dispatchEvent(new Event("reciveFileName"))
        }
      
        return true
    }
})




app.initialData = InitialDataTo



console.log(app.initialData)

const buttonJoin = new ButtonJoin();
buttonJoin.setAttribute('id', 'join-button')


const buttonCreate = new ButtonCreate();
buttonCreate.setAttribute('id', 'create-button')

const buttonTestCreate = new ButtonTestCreate();


export const getRole = (rol) => {
    console.log("clicking", rol)
   role = rol
   obj.role = rol
   console.log("clicking", rol, role)

}


var fileName = document.querySelector('.create-file-input');
var addFileButton = document.querySelector('.add-button');

addFileButton?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(proxyInitialData)
    proxyInitialData.files =   fileName.value
    proxyInitialData.fileName = fileName.value
    vscode.postMessage({
        command: 'files',
        data: JSON.stringify(app.initialData.filesArray)
    })
    fileName.value = ''
})




// setInterval(() => {
//     console.log(app.initialData)
// }, 3000)

// const proxiedStore = new Proxy(initialData, {
//     set: (tagret, property, value) => {
//         tagret[property] = value;
//         if(property == "role") {
//             console.log("dispacthed")
//             window.dispatchEvent(new Event("role"))
//         }
//         if(property == "filesArray") {
//             window.dispatchEvent(new Event("files"))
//         }
//         return true;
//     }
// })



window.addEventListener('filesupdated', (e) => {
    console.log('Files array was changed.');
});

const filesView = document.querySelector('.files-view') 
const displayFilesList = new DisplayAddedFiles();
console.log(displayFilesList)

displayFilesList.setAttribute('is', 'file-view');

filesView?.appendChild(displayFilesList)


const buttonCode = new ButtonCode();


const inputName = document.querySelector('.input-name');
const inputRegno = document.querySelector('.input-regno');
const inputCode = document.querySelector('.input-code');

console.log(inputCode, inputName,inputRegno)

inputCode?.addEventListener('change', (e) => {
    console.log(e)
    vscode.postMessage({
        code: e.target.value
    })
})
inputRegno?.addEventListener('change', (e) => {
    vscode.postMessage({
        regno: e.target.value
    })
})
inputName?.addEventListener('change', (e) => {
    vscode.postMessage({
        name: e.target.value
    })
})

window.addEventListener('message' , (e) => {
    console.log(e.data)
 })

export default proxyInitialData;




