import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from '@/core/errors/errors/invalid-attachment-type-error'

describe('upload and create attachment', () => {
  let attachmentRepository: InMemoryAttachmentRepository
  let fakeUploader: FakeUploader
  let sut: UploadAndCreateAttachmentUseCase
  beforeEach(() => {
    attachmentRepository = new InMemoryAttachmentRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      attachmentRepository,
      fakeUploader,
    )
  })
  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: attachmentRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)

    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
