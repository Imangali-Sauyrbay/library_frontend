<script setup lang="ts">
import * as L from 'leaflet'
import { geocoder, geocoders } from 'leaflet-control-geocoder'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/layers-2x.png'
import 'leaflet/dist/images/layers.png'
import markerHighUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'

import { onMounted, onUnmounted, ref } from 'vue'
import { ElMessage, ElButton, ElIcon } from 'element-plus'
import { MapLocation, Right } from '@element-plus/icons-vue'
import eventBus from '@/composables/eventBus'
import { isHTTPS } from '@/utils/CommonUtils'
import type { FinishGeocodeEvent, GeocoderControl } from 'leaflet-control-geocoder/dist/control'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const emit = defineEmits<{
    (event: 'next', result?: geocoders.GeocodingResult): void
}>()

const mapElement = ref<HTMLElement>()
const isSecure = isHTTPS()
const defaultPosition: L.LatLngExpression = [42.3200446, 69.5920421] //Auezov University
const result = ref<geocoders.GeocodingResult>()

let map: L.Map

let geoCoder: geocoders.Nominatim

let geoCoderControll: GeocoderControl

const updateGeoCoder = () => {
    geoCoder = geocoders.nominatim({
        geocodingQueryParams: {'zoom': 18, 'accept-language': locale.value},
        reverseQueryParams: {'zoom': 18, 'accept-language': locale.value},
    })

    geoCoderControll = geocoder({
        collapsed: true,
        placeholder: t('app.map.searchPlaceholder'),
        defaultMarkGeocode: false
    })
}

updateGeoCoder()

eventBus.on('langChanged', updateGeoCoder)

const myPlaceMarker = L.circleMarker(defaultPosition)

myPlaceMarker.setStyle({
    color: 'green'
})

const myPlace = () => {
    if(!map) return

    navigator.geolocation.getCurrentPosition(position => {
        const long = position.coords.longitude
        const lat = position.coords.latitude

        map?.setView([lat, long], 18)
        myPlaceMarker.setLatLng([lat, long])
            .addTo(map)
            .openPopup()

    }, error => {
        let message: string = t('app.map.errors.unknown')

        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = t('app.map.errors.permissionDenied')
                break

            case error.POSITION_UNAVAILABLE:
                message = t('app.map.errors.unknown.positionUnavailable')
                break

            case error.TIMEOUT:
                message = t('app.map.errors.timedOut')
                break
        }

        ElMessage.warning({
            duration: 5000,
            message, 
        })
    })
}

const next = () => {
    emit('next', result.value)
}

const markerIcon = new L.Icon({
    iconRetinaUrl: markerHighUrl,
    iconUrl: markerUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [26, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -40],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
})

let marker: L.Marker = L.marker(defaultPosition, {
    icon: markerIcon
})
    
let isVisible = false

const checkMarker = () => {
    if(!isVisible) {
        marker.bindPopup(t('app.map.loadingText')).addTo(map)
        isVisible = true
    }
}

const handleFinishGeocode = (e: FinishGeocodeEvent) => {
    checkMarker()

    const res = e.results[0]

    if(!res) return
    result.value = res

    marker.setLatLng(res.center)
        .setPopupContent(res.name)
        .openPopup()

    map.setView(res.center)
}

const handleMapClick = (e: L.LeafletMouseEvent) => {
    checkMarker()

    marker.setLatLng(e.latlng)
            .setPopupContent(t('app.map.loadingText'))
            .openPopup()

    geoCoder.reverse(e.latlng, map.options.crs!.scale(18), results => {
        const res = results[0]

        if(!res) return
        result.value = res
        
        marker.setLatLng(e.latlng)
            .setPopupContent(res.name)
            .openPopup()

    })
}

onMounted(() => {
    map = L.map(mapElement.value!, {
        center: defaultPosition,
        zoom: 18
    })

    geoCoderControll.addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map)

    geoCoderControll.on('finishgeocode', handleFinishGeocode)

    map.on('click', handleMapClick)

})

onUnmounted(() => {

})
</script>


<template>
    <div class="map-container">
        <div ref="mapElement" id="map">
        </div>

        <ElButton
        @click="next"
        class="map-next-btn"
        >{{ t('app.actions.next') }} <ElIcon class="el-icon--right"><Right /></ElIcon></ElButton>

        <ElButton
        v-if="isSecure"
        @click="myPlace"
        class="map-my-pos-btn"
        :icon="MapLocation"
        size="large"
        circle/>
    </div>
</template>

<style scoped>
.map-container {
    position: relative;
    width: 100%;
    height: 100%;
}

#map {
    width: 100%;
    height: 100%;
}

.map-my-pos-btn {
    position: absolute;
    bottom: 5%;
    right: 5%;
    z-index: 999;
    font-size: 20px;
}

.map-next-btn {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    font-size: 20px;
}
.map-my-pos-btn,
.map-next-btn {
    box-shadow: 0 0 10px 0 black;
}
</style>