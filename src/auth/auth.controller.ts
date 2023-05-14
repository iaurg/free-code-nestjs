import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  // private is a shorthand for declaring a private member in the class and assigning a value to it in the constructor.
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() body: AuthDto) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  signIn(@Body() body: AuthDto) {
    return this.authService.signIn(body);
  }
}
