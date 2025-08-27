export class Slug {
  public readonly value: string

  private constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Slug cannot be empty')
    }
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  static createFromText(text: string) {
    const slug = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')

    return new Slug(slug)
  }
}
