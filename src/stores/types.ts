interface Book {
    identifier: string
    title: string
    description: string
    authors: string
    quantity: number,
    librarySlug: string,
    cover?: File,
    pdf?: File,
    coverPage?: number
}

export type {
    Book
}