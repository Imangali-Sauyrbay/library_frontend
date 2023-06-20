import type { AxiosResponse } from "axios"
import Service from "./BaseService"

export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
    COWORKER = 'coworker',
    STUDENT = 'student'
}
type CachedItem = {data: any, timeToLive: number, stored: number}

class AuthService extends Service {
    private cached: Record<string, CachedItem> = {}

    public async me(): Promise<AxiosResponse> {
        if(
            this.cached['user'] &&
            (this.cached['user'].stored + this.cached['user'].timeToLive) - Date.now() > 0
        ) {
            return this.cached['user'].data as AxiosResponse
        }
        
        await this.csrf()
        const res = await this.axios.get('auth/me')

        this.cached['user'] = {
            data: res,
            stored: Date.now(),
            timeToLive: 10 * 1000 // 10s
        }

        return res
    }

    public async hasRole(role: Roles) {
        const res = await this.me()

        let has = false
        
        res.data.roles.forEach(({ name }: {name: string}) => {
            if (name === role) {
                has = true
            }
        })

        return has
    }

    public async login(email: string, password: string, remember: boolean = false) {
        await this.csrf()
        return await this.axios.post('auth/login', {
            email,
            password,
            remember
        })
    }

    public async logout() {
        await this.csrf()
        return await this.axios.post('auth/logout')
    }

    public async register(
        email: string,
        password: string,
        passwordConfirmation: string,
        uuid: string | null = null
    ): Promise<AxiosResponse<any, any>> {
        await this.csrf()

        let url = 'auth/register'

        if(uuid)
            url += '/' + uuid

        return await this.axios.post(url, {
            email,
            password,
            'password_confirmation': passwordConfirmation
        })
    }

    public async fill(data: Record<string, any>): Promise<AxiosResponse<any, any>> {
        const body: Record<string, any> = {}

        Object.keys(data).forEach(key => {
            if(data[key])
                body[key] = data[key]
        })

        await this.csrf()
        return await this.axios.post('auth/fill', body)
    }
}

const service = new AuthService()

export default service