import type {  ShallowRef, Component } from 'vue'

interface NavProps {
    name: string
    icon: ShallowRef<Component>
    exact?: boolean
}

export type {
    NavProps
}