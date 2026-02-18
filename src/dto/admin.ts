import { Static, t } from 'elysia';

export const AdminLoginDTO = t.Required(
    t.Object({
        username: t.String({
            description: 'Admin Username',
            error: 'Please Provide Username'
        }),
        password: t.String({
            description: 'Admin Password',
            error: 'Please Provide Password'
        })
    })
);

export const CreateAdminDTO = t.Object({
    username: t.String({
        title: 'Admin Username',
        error: 'Please Provide username'
    }),
    password: t.String({
        title: 'Admin Password',
        error: 'Please Provide Password'
    }),
    first_name: t.String({
        title: 'Admin First Name',
        error: 'Please Provide Admin first Name'
    }),
    last_name: t.String({
        title: 'Admin Last Name',
        error: 'Please Provide Admin Last Name'
    }),
    mobile: t.String({
        title: 'Admin Mobile',
        error: 'Please Provide Admin Mobile'
    }),
    role_id: t.String({
        title: 'Admin role',
        error: 'Please Provide Role Id'
    }),
    media_id: t.Optional(t.String())
});

export const UpdateAdminDTO = t.Object({
    id: t.String({
        title: 'Admin Id',
        error:'Please Provide Id'
    }),
    username: t.String({
        title: 'Admin UserName',
        error: 'Please Provide Admin Username'
    }),
    password: t.Optional(t.String()),
    first_name: t.Optional(t.String()),
    last_name: t.Optional(t.String()),
    mobile: t.Optional(t.String()),
    media_id: t.Optional(t.String())
});

export const ChangePasswordDTO = t.Object({
    password: t.String({
        title: 'Old Password',
        error: 'Please Provide Password'
    }),
    new_password: t.String({
        title: 'New Password',
        error: 'Please Provide New Password'
    })
});
export type ChangePasswordRequest = Static<typeof ChangePasswordDTO>;