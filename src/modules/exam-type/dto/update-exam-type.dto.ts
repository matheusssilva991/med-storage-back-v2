import { PartialType } from '@nestjs/mapped-types';
import { CreateExamTypeDTO } from './create-exam-type.dto';

export class UpdateExamTypeDTO extends PartialType(CreateExamTypeDTO) {}
