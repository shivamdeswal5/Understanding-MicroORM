export class ListTodosQuery {
      public readonly page: number
      public readonly limit: number;
      public readonly title?: string;
      public readonly completed?: boolean;
    constructor(dto:{page?: number, limit?: number, title?: string, completed?: boolean}) {
      this.page = dto.page ?? 1;
      this.limit = dto.limit ?? 10;
      this.title = dto.title;
      this.completed = dto.completed;
    }
  }
