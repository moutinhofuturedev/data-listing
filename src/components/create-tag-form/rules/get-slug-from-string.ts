class GetSlugFromString {
  execute(string: string): string {
    return string
      .normalize('NFD')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
  }
}

export const getSlugFromString = new GetSlugFromString()
