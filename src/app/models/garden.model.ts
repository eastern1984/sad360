export class Garden {
    id: string;
    name: string;
    url: string;
    text: string;
    items: string[];

    constructor(id, text, name, url, items) {
      this.id = id;
      this.name = name;
      this.text = text;
      this.url = url;      
      this.items = items;
    }
}