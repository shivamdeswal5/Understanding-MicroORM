import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ErrorMapper } from 'http-problem-details-mapper';
import { ProblemDocument } from 'http-problem-details';

export class BadRequestMapper extends ErrorMapper {
  constructor() {
    super(BadRequestException);
  }

  mapError(error: Error): ProblemDocument {
    return new ProblemDocument({
      status: HttpStatus.BAD_REQUEST,
      title: 'Bad Request',
      detail: error.message,
      type: '/problem/bad-request',
    });
  }
}
