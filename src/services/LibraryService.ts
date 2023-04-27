import type { Book } from '@/stores/types'
import BaseService from './BaseService'

type Library = {
    title: string
    displayName: string
    coords: [number, number] 
}

class LibraryService extends BaseService {
    public async getLibrary(query: string, page: number = 1) {
        return await this.axios.get('library', {
            params: { query, page }
        })
    }

    public async addLibrary(lib: Library) {
        return await this.axios.post('library', lib)
    }

    public async addBook(book: Book, callBack: (progress: number) => void = () => {}) {
        const formData = new FormData()
        formData.append('title', book.title)
        formData.append('authors', book.authors)
        formData.append('description', book.description)
        formData.append('identifier', book.identifier)
        formData.append('quantity', book.quantity.toString())
        formData.append('coverPage', (book.coverPage || 1).toString())
        formData.append('librarySlug', book.librarySlug)

        if(book.cover) {
            formData.append('cover', book.cover)
        }

        if(book.pdf) {
            formData.append('pdf', book.pdf)
        }

        return await this.axios.post('books', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true,
            onUploadProgress: e => {
                const loaded = e.loaded / (e?.total || 1)
                callBack(Math.round(loaded * 100))
            }
        })
    }
}

export type {
    Library
}

export default LibraryService