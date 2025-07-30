import { NotFoundException, HttpStatus } from '@nestjs/common';
import { ErrorMapper } from 'http-problem-details-mapper';
import { ProblemDocument } from 'http-problem-details';

export class NotFoundMapper extends ErrorMapper {
  constructor() {
    super(NotFoundException);
  }

  mapError(error: Error): ProblemDocument {
    return new ProblemDocument({
      status: HttpStatus.NOT_FOUND,
      title: 'Not Found',
      detail: error.message,
      type: '/problem/not-found',
    });
  }
}
