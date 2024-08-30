console.log('hell oworld')

window.stream = {}

const initialData = {
    clients: {}
}
var editorInstance
const proxyInitialData = new Proxy(initialData, {
    set: (target, property, value) => {
     
        if(property == 'clients') {
            target[property]  = value;
            console.log("from here broo");
            window.dispatchEvent(new Event("clientupdated"))
        }      
        return true
    }
})

const p =document.createElement('p');


window.addEventListener('clientupdated', (e) => {
    
for (const [key, value] of Object.entries(initialData.clients)) {
    p.textContent = value;
    editorInstance.setValue(value)
   
}
})

const columnOne = document.querySelector('.dashboard-col-1');

// columnOne.appendChild(p)

window.addEventListener('message' , (e) => {
   console.log(e)
   if(e.data.command === 'client') {
    const data = JSON.parse(e.data.client)
    proxyInitialData.clients = data
   }
})

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });

 require(['vs/editor/editor.main'], function() {
   editorInstance =  monaco.editor.create(columnOne, {
        value: [
            "hello"
        ].join('\n'),
        language: 'javascript',
        theme: 'vs-dark'
        
    });
    
});


// function getEditorValue() {
//     if (editorInstance) {
//         return editorInstance.getValue();
//     } else {
//         console.warn("Editor is not initialized yet.");
//         return null;
//     }
// }
if (editorInstance )console.log("monacoeditor",editorInstance.getValue())