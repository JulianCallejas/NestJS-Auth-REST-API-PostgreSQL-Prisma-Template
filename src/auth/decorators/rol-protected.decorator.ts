import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';


export const META_ROLES = 'role'

export const RolProtected = (...args: Role[]) => {
    
    // if (args && args.length > 0) args.push(Role.dev);      //Allow all endpoints for dev role

    return SetMetadata(META_ROLES, args)

};
