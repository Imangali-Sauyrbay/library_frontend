import type { 
    NavigationHookAfter,
    NavigationGuardWithThis
} from "vue-router"

type AfterEach = {
    hook: 'afterEach'
    callback: NavigationHookAfter
}

type BeforeEach = {
    hook: 'beforeEach'
    callback: NavigationGuardWithThis<undefined>
}

type BeforeResolve = {
    hook: 'beforeResolve'
    callback: NavigationGuardWithThis<undefined>
} 

type Middleware = AfterEach | BeforeEach | BeforeResolve

export type {
    Middleware
}