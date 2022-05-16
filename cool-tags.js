class TagsElement extends HTMLElement {
  static get defaults() {
    return {
      name: 'tag',
      strategy: 'query',
    };
  }

  static get strategies() {
    return {
      query: function (value, label, name, url) {
        const active = url.searchParams.get(name) === value;
        const link = new URL(url);

        link.searchParams.set(name, value);

        return `<li id="${value}" class="tag ${
          active ? 'active' : ''
        }"><a href="${link.toString()}">${label}</a></li>`;
      },
      fragment: function (value, label) {
        return `<li id="${value}" class="tag"><a href="#${value}">${label}</a></li>`;
      },
    };
  }

  get name() {
    return this.getAttribute('name') ?? TagsElement.defaults.name;
  }

  get strategy() {
    return this.getAttribute('strategy') ?? TagsElement.defaults.strategy;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    try {
      const data = JSON.parse(this.innerText);
      this.render(data);
    } catch (e) {
      console.error('Could not parse tag data from JSON.');
      console.error(e);
    }
  }

  render(data) {
    const url = new URL(window.location);
    this.innerHTML = `
      <ul class="tags">
        ${data
          .map(({ id, label }) =>
            TagsElement.strategies[this.strategy](id, label, this.name, url)
          )
          .join('')}
      </ul>
    `;
  }
}

customElements.define('cool-tags', TagsElement);
