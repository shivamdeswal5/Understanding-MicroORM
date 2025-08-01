import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  user_uuid: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
