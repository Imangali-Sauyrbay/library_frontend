import Service from "./BaseService"

type UserAuthCheckResponce = {
    isAuth: boolean,
    user?: any
}

class AuthService extends Service {
    public async isUserAuthenthicated(): Promise<UserAuthCheckResponce> {
        return {isAuth: true, user: {}}
    }
}

const service = new AuthService('https://jsonplaceholder.typicode.com')

export default service