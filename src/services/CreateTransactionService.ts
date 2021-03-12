import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let checkCategoryexist = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Tipo deve ser income ou outcome');
    }

    if (
      type === 'outcome' &&
      (await transactionsRepository.getBalance()).total < value
    ) {
      throw new AppError('Valor de Transação inválido', 400);
    }
    if (!checkCategoryexist) {
      await categoryRepository.insert({ title: category });
      checkCategoryexist = await categoryRepository.findOne({
        where: { title: category },
      });
    }

    const transaction = transactionsRepository.create({
      category_id: checkCategoryexist?.id,
      title,
      value,
      type,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
