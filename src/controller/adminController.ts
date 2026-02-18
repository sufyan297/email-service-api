import bearer from "@elysiajs/bearer";
import type { AppInstance } from "../../index";
import { AdminLoginDTO, ChangePasswordDTO, CreateAdminDTO, UpdateAdminDTO } from "../dto/admin";
import { CreateAdmin, Login, UpdateAdmin, UpdatePassword } from "../services/adminService";
import AdminAuth from '../middleware/admin_auth';
import Admin from "../models/Admin";

export const AdminController = (app: AppInstance) => {


    app.group('/admin', (app) =>
        app
            .post('/login',
                async ({ body, jwt }) => {
                    return await Login({ body, jwt });
                },
                {
                    detail: { tags: ['Admin'], description: 'Admin Login' },
                    body: AdminLoginDTO,
                },
            )
            .post('',
                async({ body, set })=>{
                    const { user } : { user: Admin } = set as any;
                    return await CreateAdmin(body,user);
                },
                {
                    detail: { tags: ['Admin'], description: 'Admin Create Or Update' },
                    beforeHandle: AdminAuth,
                    body: CreateAdminDTO
                }
            )
            .patch('',
                async({ body })=>{
                    return await UpdateAdmin(body);
                },
                {
                    detail: { tags: ['Admin'], description: 'Admin Update' },
                    beforeHandle: AdminAuth,
                    body: UpdateAdminDTO
                }
            )
            .post('/change-password',
                async({ body, set })=>{
                    const { user } : { user: Admin } = set as any;
                    return await UpdatePassword(body,user);
                },
                {
                    detail : { tags:['Admin'], description: 'Password Change For Admin' },
                    beforeHandle: AdminAuth,
                    body: ChangePasswordDTO
                }
            )
    );

}