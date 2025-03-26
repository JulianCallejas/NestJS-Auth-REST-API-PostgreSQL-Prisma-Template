import { Injectable } from '@nestjs/common';
import { GetServerListeningResponse } from './app.controller';

@Injectable()
export class AppService {
  getIsWorking(): GetServerListeningResponse {
    return {ok: true, message: "API is working"};
  }
}
