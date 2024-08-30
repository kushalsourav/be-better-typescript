// export function DisplayAddedFiles () {

//         window.addEventListener('filesupdated', () => {
//             console.log('Files array was changed.', app.initialData);

//         });

// }

export class DisplayAddedFiles extends HTMLDivElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.querySelector('.template-files-list');
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    window.addEventListener('reciveFileName', (e) => {
      this.render();
    });
    this.render();
  }

  render() {
    if (app.initialData.fileName) {
      const filesList = document.querySelector('.files-list');

      const li = document.createElement('li');
      li.textContent = app.initialData.fileName;
      filesList.appendChild(li);
    }
  }
}

customElements.define('file-view', DisplayAddedFiles, { extends: 'div' });
