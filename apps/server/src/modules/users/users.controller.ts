import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateUsersRegisterDto,
  CreateUsersBaseDto,
  GetUserInfoIdDto,
  SetUserInfoDto
} from '../../dto/users/users.dto';
import { ReturnBody } from '../../utils/returnBody';
import { UsersService } from './users.service';
import { Users } from '../../emtites/users/users.entity';
import { AuthGuard } from '@nestjs/passport';
import { RequestWidth } from 'types/express.extends';
import { ValidatePipe } from './users.validate.pipe';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }
  @Post('/register')
  @UsePipes(new ValidatePipe())
  @HttpCode(200)
  @ApiOperation({ summary: '用户注册接口' })
  async register(@Body() body: CreateUsersRegisterDto): Promise<ReturnBody<{}>> {
    return this.usersService.register(body);
  }
  @Post('/login')
  @UsePipes(new ValidatePipe())
  @HttpCode(200)
  @ApiOperation({ summary: '用户登录接口' })
  async login(@Body() body: CreateUsersBaseDto): Promise<ReturnBody<CreateUsersBaseDto | {}>> {
    return this.usersService.login(body);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('/info/:id?')
  @ApiOperation({ summary: '获取用户信息' })
  async getUserInfo(@Param('id') id: GetUserInfoIdDto, @Request() req: RequestWidth): Promise<ReturnBody<Users | {}>> {
    return this.usersService.getUserInfo(Number(id), req);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/info')
  @HttpCode(200)
  @UsePipes(new ValidatePipe())
  @ApiOperation({ summary: '修改用户信息' })
  async setUserInfo(@Request() req: RequestWidth, @Body() query: SetUserInfoDto): Promise<ReturnBody<Users | {}>> {
    return this.usersService.setUserInfo(Number(req.user.sub), query);
  }
}
