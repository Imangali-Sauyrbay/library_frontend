import type { Middleware } from './types'
import pageLoadProgress from './PageLoadProgress'
import titleMiddleware from './SetTitleMiddleware'
import authMiddleware from './AuthGuard'
import permissionsMiddleware from './PermissionsMiddleware'

const middlewares: Middleware[] = [
    ...pageLoadProgress,
    authMiddleware,
    permissionsMiddleware,
    titleMiddleware
]

export default middlewares