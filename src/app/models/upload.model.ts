export class Upload {
    $key: string;
    file: File;
    url: string;
    progress: number;
    createdOn: Date = new Date();
    name: string;
    text: string;

    constructor(file: File, text: string) {
        this.file = file;
        this.text = text;
    }
}