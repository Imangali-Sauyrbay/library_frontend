import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Book } from './types'
import LibraryService from '@/services/LibraryService'

const initial: Book = {
    authors: '',
    description: '',
    title: '',
    identifier: '',
    quantity: 0,
    librarySlug: '',
    coverPage: 1
}

export const useAddBookStore = defineStore('add-book', () => {
    const form = reactive<Book>(JSON.parse(JSON.stringify(initial)))
    const libraryService = new LibraryService()

    const reset = () => {
        form.authors = initial.authors
        form.description = initial.description
        form.title = initial.title
        form.identifier = initial.identifier
        form.quantity = initial.quantity
        form.librarySlug = initial.librarySlug,
        form.coverPage = initial.coverPage
    }

    const send = (callBack: (progress: number) => void) => {
        return libraryService.addBook(form, callBack)
    }

    const getLibraries = (query: string, page = 1) => {
        return libraryService.getLibrary(query, page)
    }

    return { form, reset, send, getLibraries }
})
