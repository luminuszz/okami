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

export interface FileUploadResponse {
  fileName: string;
  fileType: string;
}

export abstract class StorageProvider {
  abstract uploadWorkImage(file: FiletoUpload): Promise<FileUploadResponse>;
  abstract uploadWorkImageWithUrl(file: FiletoUploadWithUrl): Promise<FileUploadResponse>;
  abstract uploadAvatarImage(file: FiletoUpload): Promise<FileUploadResponse>;
}
