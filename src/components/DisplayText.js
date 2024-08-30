
export class DisplayText extends HTMLDivElement {
    editorInstance 
    constructor() {
        super();
        this.editorInstance = null; 
    }
    connectedCallback() {
        const template = document.querySelector('.template-client-text')
        const content = template.content.cloneNode(true)
        this.appendChild(content)

        this.editor()

    }
    render() {
        console.log("second me")
        const client = stream.initialData.clients;
        client.map((e) => {
            for (const [key, value] of Object.entries(e.files)) {
                
                this.editorInstance?.setValue(value)
            }
        })
        
        console.log(this.editorInstance?.getValue())
    }
    editor() {
        var newEditorInstance
       
        window.addEventListener('clientupdated', () => {
            const client = stream.initialData.clients;
        client.map((e) => {
            for (const [key, value] of Object.entries(e.files)) {
                
                newEditorInstance.setValue(value)
            }
        })

        })
        console.log("first me")
        const editorView = document.querySelector('.editor-view');
        const newEditor = document.createElement('div')
        newEditor.setAttribute('class', 'editor')
        newEditor.style.width = '500px'
        newEditor.style.height = '500px'
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });

        require(['vs/editor/editor.main'], function () {
           newEditorInstance =  monaco.editor.create(newEditor, {
                value: [
                    "hello"
                ].join('\n'),
                language: 'javascript',
                theme: 'vs-dark'

            });
            
        
        });

        editorView.appendChild(newEditor);
        // this.editorInstance = newEditorInstance
    }
}


customElements.define('text-list', DisplayText, { extends: 'div' })