export interface ITransaction {
	name: string;
	amount: number;
	type: TTransactionType;
	createdAt: string;
}

export type TTransactionType = 'income' | 'outcome';
