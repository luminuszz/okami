export interface FiletoUpload {
  fileName: string;
  fileData: ArrayBuffer;
  fileMimeType: string;
}

export abstract class StorageProvider {
  abstract uploadWorkImage(file: FiletoUpload): Promise<void>;
}
