import { MapperRegistry } from 'http-problem-details-mapper';

export class MappingStrategy {
  constructor(private readonly registry: MapperRegistry) {}

  map(error: Error) {
    const errorMapper = this.registry.getMapper(error);
    if (errorMapper) {
      return errorMapper.mapError(error);
    }

    // fallback: generic internal server error
    return {
      status: 500,
      title: 'Internal Server Error',
      detail: error.message,
      type: `/problem/${error.name}`,
    };
  }
}
