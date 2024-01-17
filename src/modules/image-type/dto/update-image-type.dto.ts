import { PartialType } from '@nestjs/mapped-types';
import { CreateImageTypeDto } from './create-image-type.dto';

export class UpdateImageTypeDto extends PartialType(CreateImageTypeDto) {}
