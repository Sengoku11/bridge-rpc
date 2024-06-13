import { Controller, Get, Redirect } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  @Redirect('/api', 302)
  root() {
    return { url: '/api' };
  }
}
