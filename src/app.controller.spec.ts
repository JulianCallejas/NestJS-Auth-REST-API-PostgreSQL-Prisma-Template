import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(() => {
    controller = new AppController(new AppService());
  });

  it('should return health check', () => {
    expect(controller.getHello()).toEqual({
      ok: true,
      message: 'API is working'
    });
  });
});