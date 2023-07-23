interface FiletoUpload {
  fileName: string;
  fileData: ArrayBuffer;
  fileMimeType: string;
}

export abstract class StorageProvider {
  abstract uploadFile(file: FiletoUpload): Promise<void>;
}
