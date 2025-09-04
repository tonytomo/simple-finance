export interface IFlow {
	name: string;
	amount: number;
	type: TFlowType;
	repeat: TFlowRepeat;
	isActive: boolean;
}

export type TFlowType = 'in' | 'out';

export type TFlowRepeat = 'daily' | 'weekly' | 'monthly' | 'yearly';
