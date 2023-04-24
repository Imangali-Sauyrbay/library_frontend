import mitt from 'mitt'

type Events = {
    asyncComponentLoading?: null
    asyncComponentLoaded?: null
    asyncComponentError?: null
    langChanged?: string
}

const eventBus = mitt<Events>()

export default eventBus