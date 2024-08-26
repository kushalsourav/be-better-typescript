import { vscode } from "../js/script.js";

export class ButtonCode extends HTMLButtonElement {
  
    constructor() {

        super();
        this.textContent = 'join'
        this.style.color = "#fff"
        this.style.letterSpacing = '1px'
        this.style.outline = 'none'
        this.style.border = 'none'
        this.addEventListener("click", () => {
            vscode.postMessage({
               switch: 'student'
            })
        })
    }

};

customElements.define('join-code-button', ButtonCode, {extends: 'button'})