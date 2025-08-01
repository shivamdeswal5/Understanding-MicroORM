import { Test } from '@nestjs/testing';
import { UpdateTodoHandler } from '../../../../src/features/todo/update-todo/update-todo.handler';
import { TodoRepository } from '../../../../src/infrastructure/repository/todo/todo.repository';
import { UpdateTodoDto } from '../../../../src/features/todo/update-todo/update-todo.dto';

describe('UpdateTodoHandler (unit)', () => {
  let handler: UpdateTodoHandler;
  let todoRepository: jest.Mocked<TodoRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateTodoHandler,
        {
          provide: TodoRepository,
          useValue: {
            updateTodo: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(UpdateTodoHandler);
    todoRepository = moduleRef.get(TodoRepository);
  });

  it('should update todo successfully', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const dto: UpdateTodoDto = {
      title: 'New title',
      description: 'New description',
    };

    const result = await handler.handle(uuid, dto);

    expect(todoRepository.updateTodo).toHaveBeenCalledWith(uuid, dto);
    expect(result).toEqual({ message: 'Todo updated successfully' });
  });
});
