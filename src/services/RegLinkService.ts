import type { AxiosResponse } from "axios";
import Service from "./BaseService"

export interface RegistrationLink {
    id:         number;
    uuid:       string;
    use_count:  number;
    expires:    string;
    library_id: number;
    role_id:    number;
    created_at: string;
    updated_at: string;
    role?:       Role;
    library?:    Library;
}

export interface Library {
    title:      string;
    slug:       string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    name: string;
}

class RegLinkService extends Service {
    private uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    public async getLink(uuid: string): Promise<AxiosResponse<RegistrationLink, any>> {
        if(!uuid || !this.validateUUID(uuid)) 
            throw new Error('UUID is required and it should be valid UUID');
        
        await this.csrf()
        return await this.axios.get<RegistrationLink>('auth/reglink/' + uuid)
    }

    public validateUUID(uuid: string): boolean {
        return this.uuidPattern.test(uuid);
    }
}

const service = new RegLinkService()

export default service