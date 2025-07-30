import { IsNotEmpty, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateTodoDto {
  @IsUUID()
  user_uuid: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
