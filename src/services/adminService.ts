import Admin from "../models/Admin";
import { APIResponse } from "../GlobalResponseHandler";
import { getCount, getOne, saveData } from "../../libs/Query";
import { AppError, BadRequestException, ResourceNotFoundException, UnAuthorizedAccessException } from "../../libs/Errors";
import { compare, hash } from 'bcrypt';
import { ChangePasswordRequest } from "../dto/admin";

const Login = async({body,jwt} : { body: any, jwt:any }):Promise<APIResponse<{admin:Admin,token:string}>> =>{
    try {

        const { username, password } = body;
        
        let admin = await getOne<Admin>('Admin',{
            where:{
                username: username,
            },
            relations: {
                role: true
            }
        });

        if(!admin)
            throw new ResourceNotFoundException('Cannot Find Admin');

        const match = await compare(password,admin.password);

        if(!match)
            throw new UnAuthorizedAccessException('Credentials Did Not Match');

        let token = await jwt.sign({ sub: admin.id });

        return {
            data: { admin, token },
            message: 'Logged In Successfully',
            success:true
        }
    } catch (error) {
        throw error;
    }
}

const CreateAdmin = async(body:Partial<Admin>,user: Admin):Promise<APIResponse<Admin>>=>{
    try {

        const { username, password, id, ...admin } = body;

        const existingUsername = await getCount('Admin',{
            where:{
                username: username,
                is_active: true
            }
        });

        if(existingUsername > 0)
            throw new AppError('Username Already Exists',409);
        
        const newAdmin = await saveData<Admin>('Admin',{
            ...admin,
            username: username,
            password: await hash(password!,13)
        }) as Admin;

        return {
            data: newAdmin,
            message: 'Admin Created Successfully',
            success: true
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const UpdateAdmin = async(body:Partial<Admin>):Promise<APIResponse<Admin>>=>{
    try {

        const { username, id, password, ...admin  } = body;

        const existingUsername = await getCount('Admin',{
            where:{
                username: username,
                'id !=': id,
                is_active: true
            }
        });

        if(existingUsername > 0)
            throw new AppError('Username Already Exists',409);

        console.log(admin)

        const updatedAdmin = await saveData('Admin',{
            id: id, 
            ...admin,
            ...password ? {
                password: await hash(password,13)
            } : {}
        }) as Admin;

        return {
            data: updatedAdmin,
            message: 'Admin Created Successfully',
            success: true
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const UpdatePassword = async (body: ChangePasswordRequest, user: Admin): Promise<APIResponse<boolean>> => {
    try{

        const { new_password, password: old_password } = body;

        const match = await compare(old_password,user.password);

        if(!match)
            throw new BadRequestException('Old Password Did Not Match');

        await saveData('Admin',{
            id: user.id,
            password: await hash(new_password,13)
        });
        
        return {
            data: true,
            message: 'Password Update Successfully',
            success: true
        }
    }catch(error){
        console.error(error);
        throw error;
    }
}

export {
    Login,
    CreateAdmin,
    UpdateAdmin,
    UpdatePassword
}