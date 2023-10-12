import { expect, test } from 'vitest'
import { Slug } from './slug'

test('should be able to create an new slug from text', async () => {
  const slug = Slug.createFromText('Example question title')
  const slugPTBR = Slug.createFromText('Exemplo com arrecadação')

  expect(slug.value).toEqual('example-question-title')
  expect(slugPTBR.value).toEqual('exemplo-com-arrecadacao')
})
