import { MapperRegistry } from 'http-problem-details-mapper';
import { BadRequestMapper } from './mappers/bad-request.mapper';
import { NotFoundMapper } from './mappers/not-found.mapper';

export class MapperRegistryFactory {
  static create(): MapperRegistry {
    return new MapperRegistry({ useDefaultErrorMapper: false })
      .registerMapper(new BadRequestMapper())
      .registerMapper(new NotFoundMapper());
  }
}
