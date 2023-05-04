interface CoordPoint {
    lat: number
    lng: number 
}

interface NominatimAddress {
    amenity?: string
    shop?: string
    building?: string
    house_number?: string
    landuse?: string
    aeroway?: string
    railway?: string
    road?: string
    municipality?: string
    neighbourhood?: string
    city_district?: string
    city?: string
    hamlet?: string
    village?: string
    town?: string
    county?: string
    suburb?: string
    state?: string
    state_district?: string
    "ISO3166-2-lvl4"?: string
    postcode?: string
    country: string
    country_code: string
}

interface NomitnatimResponceProperties {
    place_id: number
    licence: string
    osm_type: string
    osm_id: number
    lat: number
    lon: number
    display_name: string
    address: NominatimAddress
    boundingbox: [
        number,
        number,
        number,
        number
    ]
}

interface NomitnatimResponce {
    name: string
    html: string
    center: CoordPoint
    bbox: {
        _southWest: CoordPoint,
        _northEast: CoordPoint
    },
    properties: NomitnatimResponceProperties
}

export type {
    NomitnatimResponce,
    NominatimAddress
}