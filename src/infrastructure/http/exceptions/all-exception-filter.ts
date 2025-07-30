import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { MapperRegistryFactory } from './mapper.registry';
import { MappingStrategy } from './mapper.strategy';
import { ProblemDocument } from 'http-problem-details';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly mappingStrategy = new MappingStrategy(MapperRegistryFactory.create());

  constructor(protected readonly httpAdapterHost: HttpAdapterHost) {
    super(httpAdapterHost.httpAdapter);
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const problemDetails: ProblemDocument = this.mappingStrategy.map(exception);

    // RFC 7807 additions
    problemDetails.instance = request.url;

    if (!problemDetails.type) {
      problemDetails.type = `/problem/${exception?.name || 'internal-error'}`;
    }

    response.status(problemDetails.status || 500).json(problemDetails);
  }
}
