import BaseService from './BaseService'

type Library = {
    title: string
    displayName: string
    coords: [number, number] 
}

class LibraryService extends BaseService {
    public async addNew(lib: Library) {
        return await this.axios.post(this.apiUrl + 'library', lib)
    }
}

export type {
    Library
}

export default LibraryService