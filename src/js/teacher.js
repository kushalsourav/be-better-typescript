console.log('hell oworld');
import { DisplayClient } from '../components/DisplayClient.js';
import { DisplayText } from '../components/DisplayText.js';
window.stream = {};

const initialData = {
  clients: [],
};

stream.initialData = initialData;

const proxyInitialDisplayData = new Proxy(initialData, {
  set: (target, property, value) => {
    if (property == 'clients') {
      target[property] = value;
      console.log('from here broo');
      window.dispatchEvent(new Event('clientupdated'));
    }
    return true;
  },
});

const p = document.createElement('p');

window.addEventListener('clientupdated', (e) => {
  console.log(initialData.clients);
  // for (const [key, value] of Object.entries(initialData.clients)) {
  //     p.textContent = value;
  //     editorInstance.setValue(value)

  // }
});

const columnOne = document.querySelector('.dashboard-col-1');
const columnTwo = document.querySelector('.dashboard-col-2');
// columnOne.appendChild(p)

const displayClient = new DisplayClient();
displayClient.setAttribute('is', 'client-list');

displayClient.textContent = 'Students connected';

columnOne.appendChild(displayClient);

const displayText = new DisplayText();
displayText.setAttribute('is', 'text-list');

displayText.textContent = 'view';
columnTwo.appendChild(displayText);

window.addEventListener('message', (e) => {
  console.log(e);
  if (e.data.command === 'client') {
    const data = JSON.parse(e.data.client);
    proxyInitialDisplayData.clients = data;
  }
});

// require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });

//  require(['vs/editor/editor.main'], function() {
//    editorInstance =  monaco.editor.create(columnTwo, {
//         value: [
//             "hello"
//         ].join('\n'),
//         language: 'javascript',
//         theme: 'vs-dark'

//     });

// });

// function getEditorValue() {
//     if (editorInstance) {
//         return editorInstance.getValue();
//     } else {
//         console.warn("Editor is not initialized yet.");
//         return null;
//     }
// }


export {proxyInitialDisplayData}