import { vscode } from "../js/script.js";

export class ButtonCreate extends HTMLButtonElement {
    constructor() {
        super();
        this.textContent = 'create'
        this.style.color = "#fff"
        this.style.letterSpacing = '1px'
        this.style.outline = 'none'
        this.style.border = 'none'
        this.addEventListener("click", () => {
            console.log("clcking")
            vscode.postMessage({
                command: 'role',
                role: 'create',
            })
        })
    }

   

};

customElements.define('create-button', ButtonCreate, {extends: 'button'})