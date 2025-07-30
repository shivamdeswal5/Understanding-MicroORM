import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  descrption?: string;

  @IsOptional()
  completed?: boolean;
}
