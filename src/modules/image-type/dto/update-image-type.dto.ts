import { PartialType } from '@nestjs/mapped-types';
import { CreateImageTypeDTO } from './create-image-type.dto';

export class UpdateImageTypeDTO extends PartialType(CreateImageTypeDTO) {}
