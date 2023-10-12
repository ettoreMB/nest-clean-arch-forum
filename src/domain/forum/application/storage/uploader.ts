export interface UploadParams {
  fileType: string
  fileName: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
}
