export class DisplayClient extends HTMLDivElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const template = document.querySelector('.template-client-list');
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    window.addEventListener('clientupdated', () => {
      this.render();
    });
    this.render();
  }
  render() {
    const client = stream.initialData.clients;
    const renderList = document.querySelector('.client-list');
    let filesArray = [];
    console.log(stream.initialData, client.files, typeof stream.initialData);
    console.log(client.length);
    renderList.innerHTML = client
      ?.map((e) => {
        for (const [key, value] of Object.entries(e.files)) {
          filesArray.push(key);
        }
        return `<h4>${e.name}</h4>
       ${filesArray?.map((e) => `<li>${e}</li>`).join('')}
       `;
      })
      .join('');
  }
}

customElements.define('client-list', DisplayClient, { extends: 'div' });
