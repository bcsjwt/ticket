import { File } from '../model/file';

export class FileResponse {
  constructor(readonly file: File) {}

  toJSON() {
    return {
      id: this.file.id,
      name: this.file.name,
      mime: this.file.mime,
      url: this.file.url,
    };
  }
}