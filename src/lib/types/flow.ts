export interface IFlow {
	name: string;
	amount: number;
	type: TFlowType;
	startAt: string;
	endAt: string;
	repeat: TFlowRepeat;
}

export type TFlowType = 'in' | 'out';

export type TFlowRepeat = 'daily' | 'weekly' | 'monthly' | 'yearly';
