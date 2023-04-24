import axios, { type AxiosInstance } from 'axios'

abstract class Service {
    protected readonly axios: AxiosInstance;
    protected readonly baseUrl: string = 'localhost:8080'
    protected readonly apiUrl: string = '/api/v1/'

    constructor(url?: string) {
        if(url) {
            this.baseUrl = url
        }

        this.axios = axios.create({
            baseURL: url,
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }
}

export default Service