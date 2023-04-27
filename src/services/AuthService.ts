import Service from "./BaseService"

type UserAuthCheckResponce = {
    isAuth: boolean,
    user?: any
}

class AuthService extends Service {
    private isAuth = false

    public async isUserAuthenthicated(): Promise<UserAuthCheckResponce> {
        return {isAuth: this.isAuth, user: {}}
    }

    public async login() {
        await new Promise(res => setTimeout(res, 2000))
        this.isAuth = true
        return true
    }
}

const service = new AuthService()

export default service