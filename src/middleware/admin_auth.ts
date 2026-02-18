import { UnAuthorizedAccessException } from "../../libs/Errors";
import { getOne } from "../../libs/Query";
import Admin from "../models/Admin";

export default async ({ bearer, jwt, set }: any)=>{
    try {
        if(!bearer)
            throw new UnAuthorizedAccessException('Unauthorized access!');

        const payload = await jwt.verify(bearer);
        if(!payload)
            throw new UnAuthorizedAccessException('Invalid Token');

        let { sub } = payload;

        if(!sub)
            throw new UnAuthorizedAccessException('Invalid Token');

        let admin = await getOne<Admin>('Admin',{
            where:{
                id: sub,
                is_active: true
            }
        });

        if(!admin)
            throw new UnAuthorizedAccessException('Cannot Verify Session');

        set.user = admin;
    } catch (error) {
        console.error(error);
        throw error;
    }
}