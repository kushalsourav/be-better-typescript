import { vscode } from "../js/script.js";

export class ButtonTestCreate extends HTMLButtonElement {
    constructor() {
        super();
        this.textContent = 'create'
        this.style.color = "#fff"
        this.style.letterSpacing = '1px'
        this.style.outline = 'none'
        this.style.border = 'none'
        this.addEventListener("click", () => {
            vscode.postMessage({
                switch: 'teacher'
            })
        })
    }

   

};

customElements.define('create-test-button', ButtonTestCreate, {extends: 'button'})