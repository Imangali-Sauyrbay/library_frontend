import { shallowRef } from 'vue'
import { complexSortBy } from '@/utils/Sort'
import type { IParallaxCloud, IParallaxImage } from './types'
import BackgroundImage from './../components/images/BackgroundImage.vue'
import BigCloudImage from './../components/images/BigCloudImage.vue'
import LogoImage from './../components/images/LogoImage.vue'
import BuildingImage from './../components/images/BuildingImage.vue'
import StatueImage from './../components/images/StatueImage.vue'
import ParallaxWelcomeCard from './../components/ParallaxWelcomeCard.vue'
import { flatten } from '@/utils/Array'

const initialImages: IParallaxCloud[] = [
    // Sky
    {
        depth: 0.05,
        component: shallowRef(BackgroundImage)
    },

    // Big Clouds
    {
        depth: 0.1,
        component: shallowRef(BigCloudImage)
    },

    {
        depth: 0.15,
        component: shallowRef(BigCloudImage),
        classes: ['right']
    },

    // Logo

    {
        depth: 0.3,
        component: shallowRef(LogoImage)
    },

    // Building
    {
        depth: 0.4,
        component: shallowRef(BuildingImage)
    },
    {
        depth: 0.5,
        component: shallowRef(StatueImage)
    },


    // welcome card
    {
        depth: 0.7,
        component: shallowRef(ParallaxWelcomeCard)
    },
]

const urlsToAllAssets = [
    new URL('@/assets/welcome-parallax/parts/cloud_small_1.png', import.meta.url).href,
    new URL('@/assets/welcome-parallax/parts/cloud_small_2.png', import.meta.url).href,
    new URL('@/assets/welcome-parallax/parts/cloud_small_3.png', import.meta.url).href,
    new URL('@/assets/welcome-parallax/parts/cloud_big.png', import.meta.url).href,
    new URL('@/assets/welcome-parallax/ukgu_sky.jpg', import.meta.url).href,
    new URL('@/assets/welcome-parallax/parts/logo.png', import.meta.url).href,
    new URL('@/assets/welcome-parallax/parts/auzov.png', import.meta.url).href,
    new URL('@/assets/welcome-parallax/ukgu_building.png', import.meta.url).href,
    new URL('@/assets/welcome-parallax/parts/branch_1.png', import.meta.url).href,
    new URL('@/assets/welcome-parallax/parts/branch_2.png', import.meta.url).href,
    new URL('@/assets/welcome-parallax/parts/branch_corner.png', import.meta.url).href,
]


const images = new Map<string, string>()

const ensureImagesAreLoaded = (
    urls: string[],
    percent: number,
    onProgress: (total: number, loaded: number, failed: number) => void
    = () => {},
    maxConcurrency: number = 2
): Promise<void> => {
    let loaded = 0
    let failed = 0
    const total = urls.length
    const target = Math.ceil(total * (percent / 100))
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const loadImage = (url: string): () => Promise<void> => {
        return () => new Promise((resolve, reject) => {
            const img = new Image()

            img.onload = () => {
                canvas.width = img.width
                canvas.height = img.height
                context?.drawImage(img, 0, 0)
                canvas.toBlob((blob) => {
                    if(blob) {
                        images.set(url, URL.createObjectURL(blob));
                    }
                });

                loaded++;
                resolve();
            }

            img.onerror = () => {
                failed++
                reject()
            }

            img.src = url
        })
    }

    const imagePromises: Promise<void>[] = []
    const imageLoaders = urls.map(loadImage)

    return new Promise((resolve, reject) => {
        let currentConcurrency = 0
        let currentIndex = 0

            
        const checkLoaded = () => {
            onProgress(total, loaded, failed)
            if (loaded + failed === total) {
              if (loaded >= target) {
                resolve()
              } else {
                reject()
              }
            }
          }
    
        const processNext = () => {
            while (currentConcurrency < maxConcurrency && currentIndex < total) {
                currentConcurrency++
                
                const cb = () => {
                    currentConcurrency--
                    processNext()
                }

                const loader = imageLoaders[currentIndex]()

                loader.then(cb, cb).finally(checkLoaded)
                imagePromises.push(loader)
                currentIndex++
            }
        }
    
        processNext()
    })
}


export {
    ensureImagesAreLoaded,
    urlsToAllAssets,
    images
}


export default (...additional: (IParallaxImage[])[]): IParallaxImage[] => {
    const images = flatten<IParallaxImage>(additional)
    return complexSortBy([...initialImages, ...images], 'depth')
}
