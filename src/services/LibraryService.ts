import type { Book } from '@/stores/types'
import BaseService from './BaseService'
import type { NominatimAddress } from '@/components/types'

interface LibraryAddress extends NominatimAddress {
    displayName: string
    lat: number
    lng: number
}

type Library = {
    title: string
    address: LibraryAddress
}



interface BookResponce {
    hits:             Hit[]
    query:            string
    processingTimeMs: number
    hitsPerPage:      number
    page:             number
    totalPages:       number
    totalHits:        number
    books:            BookMap
}

interface BookMap {
    [key: string]: ResponceBook
}

interface ResponceBook {
    title:         string
    authors:       string
    description:   string
    identifier:    string
    country:       string
    lang:          string
    released:      number
    quantity:      number
    slug:          string
    bookable?:     LibraryResponce
    bookable_type: string
    bookable_id:   number
    created_at:    string
    updated_at:    string
}

interface Hit {
    page:      number
    matches:   Matches
    book_slug: string
}

interface Matches {
    content: Match[]
    [key: string]: Match[]
}

interface Match {
    match: string
    text:  string
}


interface LibraryResponce {
    title:      string;
    slug:       string;
    created_at: string;
    updated_at: string;
    address:    LibraryAddress;
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

    public async getBook<T>(search='', page = 1) {
        return this.axios.get<T>('books', {
            params: {
                page,
                search
            }
        })
    }

    public getBookCoverUrl(slug: string) {
        return this.baseUrl + this.apiUrl + 'books/' + slug + '/cover'
    }

    public async addBook(book: Book, callBack: (progress: number) => void = () => {}) {
        const formData = new FormData()
        formData.append('title', book.title)
        formData.append('authors', book.authors)
        formData.append('lang', book.lang)
        formData.append('country', book.country)
        formData.append('released', book.released.toString())
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
    Library,
    BookResponce,
    Book,
    BookMap,
    Hit
}

export default LibraryService