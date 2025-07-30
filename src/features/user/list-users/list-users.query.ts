export class ListUsersQuery {
  public readonly page: number;
  public readonly limit: number;
  public readonly search?: string;

  constructor(dto: { page?: number; limit?: number; search?: string }) {
    this.page = dto.page ?? 1;
    this.limit = dto.limit ?? 10;
    this.search = dto.search;
  }
}