import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/rol-protected.decorator';
import { User } from 'src/user/entities/user.entity';



@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector   //Permite tener acceso a la informacion de los decoradores y la metadata de la request
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    
    const validRol: string[] = this.reflector.get(META_ROLES, context.getHandler());

    //SI NO SE ESPECIFICAN ROLES, ENTONCES EL ACCESO ES PUBLICO
    if (!validRol || validRol.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    
    if (validRol.includes(user.role)) return true

    throw new ForbiddenException(`${user.email} is not authorized for this resource.`)
   
  }
}
