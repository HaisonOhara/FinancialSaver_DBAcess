import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transacationsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transacationsRepository.findOne(id);
    if (!transaction) {
      throw new AppError('Transacation does not exist');
    }
    await transacationsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
