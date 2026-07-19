import { AxiosUserRepository } from '@/infrastructure/adapters/axios-user.repository';
import { UserUseCase } from '@/application/use-cases/user.use-case';

export const userUseCase = new UserUseCase(new AxiosUserRepository());
