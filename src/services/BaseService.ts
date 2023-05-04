import axios, { type AxiosInstance } from 'axios'

abstract class Service {
    protected readonly axios: AxiosInstance;
    protected readonly baseUrl: string = 'http://localhost:8000'
    protected readonly apiUrl: string = '/api/v1/'

    constructor(url?: string) {
        if(url) {
            this.baseUrl = url
        } else {
            url = this.baseUrl + this.apiUrl
        }

        this.axios = axios.create({
            baseURL: url,
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        this.axios.get(this.baseUrl + '/sanctum/csrf-cookie')
    }
}

export default Service