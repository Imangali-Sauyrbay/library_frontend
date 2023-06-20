import axios, { type AxiosInstance } from 'axios'

abstract class Service {
    protected readonly axios: AxiosInstance;
    protected readonly baseUrl: string = 'http://localhost:8000'
    protected readonly apiUrl: string = '/api/v1/'

    constructor(baseUrl?: string) {
        if(baseUrl) {
            this.baseUrl = baseUrl
        } else {
            baseUrl = this.baseUrl + this.apiUrl
        }

        this.axios = axios.create({
            baseURL: baseUrl,
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }

    protected async csrf() {
        return await this.axios.get(this.baseUrl + '/sanctum/csrf-cookie')
    }
}

export default Service