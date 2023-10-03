export interface FiletoUpload {
  fileName: string;
  fileData: ArrayBuffer;
  fileMimeType: string;
}

export interface FiletoUploadWithUrl {
  fileName: string;
  fileData: string;
  fileMimeType: string;
}

export abstract class StorageProvider {
  abstract uploadWorkImage(file: FiletoUpload): Promise<void>;

  abstract uploadWorkImageWithUrl(file: FiletoUploadWithUrl): Promise<void>;
}
