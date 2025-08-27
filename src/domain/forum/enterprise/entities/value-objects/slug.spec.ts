import { Slug } from './slug'

test('it should be able to create a slug from text', () => {
  const slug = Slug.createFromText('Exemplo de slug')
  expect(slug.value).toEqual('exemplo-de-slug')

  const slug2 = Slug.createFromText(
    'Meta diária de desenvolvimento de software',
  )
  expect(slug2.value).toEqual('meta-diaria-de-desenvolvimento-de-software')
})
