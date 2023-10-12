import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'crypto'

@Injectable()
export class S3Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    // const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')
    // const accountId = envService.get('AWS_BUCKET_NAME')

    this.client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({ body, fileName, fileType }: UploadParams) {
    const uploadId = randomUUID()

    const uniqueFileName = `${uploadId}-${fileName}`
    const input = {
      Bucket: this.envService.get('AWS_BUCKET_NAME'),
      Key: uniqueFileName,
      ContentType: fileType,
      Body: body,
    }
    const command = new PutObjectCommand(input)

    await this.client.send(command)
    return { url: uniqueFileName }
  }
}
