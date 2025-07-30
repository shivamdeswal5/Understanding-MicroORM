export class CreateTodoCommand {
    constructor(
      public readonly title: string,
      public readonly description: string,
      public readonly user_uuid: string,
      public readonly completed: boolean,
    ) {}
  }
  