import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDatabaseDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  examType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  imageQuality: Array<number>;

  @IsString()
  @IsNotEmpty()
  imageType: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  path: string;

  @IsOptional()
  images: Array<object>;
}
