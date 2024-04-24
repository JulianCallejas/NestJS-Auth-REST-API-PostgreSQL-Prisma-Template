import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';


class GetServerListeningResponse {
  @ApiProperty({
    example: true,
    description: "ok",
    format: "boolean",
  })
  ok: boolean;

  @ApiProperty({
    example: "API is working",
    description: "message",
    format: "string",
  })
  message: string;
}
@ApiTags('API-Server-Listening')    //Swagger
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Check Server Status',
    description: 'Check the Server is up and running',
  })
  @ApiResponse({status: 200, description: 'Ok', type: GetServerListeningResponse  })          //Swagger
  getHello(): GetServerListeningResponse {
    Logger.log(`API is working`);
    return {ok: true, message: "API is working"};
  }
}
