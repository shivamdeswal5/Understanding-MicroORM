import { IsEmail, IsNotEmpty, IsString, IsIn, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn(['owner', 'passenger'], { message: 'Role must be either owner or passenger' })
  role: 'owner' | 'passenger';
}
