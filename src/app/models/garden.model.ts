export class Garden {
    id: string;
    name: string;
    url: string;
    text: string;
    itemIds?: string[];

    constructor(id, text, name, url) {
      this.id = id;
      this.name = name;
      this.text = text;
      this.url = url;      
    }
}