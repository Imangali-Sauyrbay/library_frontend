import { reactive } from 'vue'
import { defineStore } from 'pinia'
import LibraryService, { type Library } from '@/services/LibraryService'
import type { NomitnatimResponce } from '@/components/types'

const initial: Library = {
    title: '',
    address: {
        displayName: '',
        lat: 0,
        lng: 0,
        amenity: '',
        shop: '',
        building: '',
        house_number: '',
        landuse: '',
        aeroway: '',
        railway: '',
        road: '',
        municipality: '',
        neighbourhood: '',
        city_district: '',
        city: '',
        hamlet: '',
        village: '',
        town: '',
        county: '',
        suburb: '',
        state: '',
        state_district: '',
        "ISO3166-2-lvl4": '',
        postcode: '',
        country: '',
        country_code: ''
    }
}

export const useLibraryFormStore = defineStore('add-library', () => {
    let form = reactive<Library>(JSON.parse(JSON.stringify(initial)))
    const libraryService = new LibraryService()

    const reset = () => {
        form = JSON.parse(JSON.stringify(initial))
    }

    const send = () => {
        return libraryService.addLibrary(form)
    }

    const set = (res: NomitnatimResponce) => {
        form.address.displayName = res.properties.display_name
        form.address = {
            ...res.properties.address,
            displayName: res.properties.display_name,
            lat: res.center.lat,
            lng: res.center.lng
        }
    }

    return { form, reset, send, set }
})
