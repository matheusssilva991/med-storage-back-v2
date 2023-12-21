import { PartialType } from '@nestjs/mapped-types';
import { CreateDatabaseDTO } from './create-database.dto';

export class UpdateDatabaseDto extends PartialType(CreateDatabaseDTO) {}
