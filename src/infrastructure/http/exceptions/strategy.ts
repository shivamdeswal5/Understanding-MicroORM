import { ProblemDocument } from 'http-problem-details';
import { MapperRegistry } from 'http-problem-details-mapper';

export class MappingStrategy {
  constructor(private readonly registry: MapperRegistry) {}

  map(error: Error): ProblemDocument {
    const errorMapper = this.registry.getMapper(error);

    if (errorMapper) {
      return errorMapper.mapError(error);
    }

    return {
      status: 500,
      title: 'Internal Server Error',
      detail: error.message,
      type: `/problem/${error.name}`,
    };
  }
}
