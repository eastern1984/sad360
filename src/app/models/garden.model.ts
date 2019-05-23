export class Garden {
    name: string;
    url: string;
    text: string;
    itemIds?: string[];

    constructor(text, name, url) {
      this.name = name;
      this.text = text;
      this.url = url;      
    }
}