import { vscode } from "../js/script.js";

export class ButtonJoin extends HTMLButtonElement {
  
    constructor() {

        super();
        this.textContent = 'join'
        this.style.color = "#fff"
        this.style.letterSpacing = '1px'
        this.style.outline = 'none'
        this.style.border = 'none'
        this.addEventListener("click", () => {
            vscode.postMessage({
                command: 'role',
                role: 'join'
            })
        })
    }

};

customElements.define('join-button', ButtonJoin, {extends: 'button'})