import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from '../../../../src/features/user/delete-user/delete-user.controller';
import { DeleteUserHandler } from '../../../../src/features/user/delete-user/delete-user.handler';
import { NotFoundException } from '@nestjs/common';

describe('Test case for DeleteUserController', () => {
  let controller: DeleteUserController;
  let handler: DeleteUserHandler;

  beforeEach(async () => {
    const mockHandler = {
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        {
          provide: DeleteUserHandler,
          useValue: mockHandler,
        },
      ],
    }).compile();

    controller = module.get(DeleteUserController);
    handler = module.get(DeleteUserHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete user and return message', async () => {
    const uuid = 'abc-123';
    const response = { message: 'User deleted successfully' };

    (handler.handle as jest.Mock).mockResolvedValue(response);

    const result = await controller.handle(uuid);

    expect(handler.handle).toHaveBeenCalledWith(uuid);
    expect(result).toEqual(response);
  });

  it('should propagate NotFoundException if user not found', async () => {
    const uuid = 'non-existent-uuid';
    (handler.handle as jest.Mock).mockRejectedValue(new NotFoundException('User not found'));

    await expect(controller.handle(uuid)).rejects.toThrow(NotFoundException);
    expect(handler.handle).toHaveBeenCalledWith(uuid);
  });
});
