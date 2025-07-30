export class CreateUserCommand {
    constructor(
      public readonly first_name: string,
      public readonly last_name: string,
      public readonly email: string,
    ) {}
  }
  