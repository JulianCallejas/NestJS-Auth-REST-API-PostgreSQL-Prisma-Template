import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";


export class LoginResponse {
    
    @ApiProperty({
        description: "User Data",
        oneOf: [{ $ref: getSchemaPath(User) }],
        type: () => User,
    })
    user: User;

    @ApiProperty({
        description: "JWT Token",
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    })
    token: string;
}