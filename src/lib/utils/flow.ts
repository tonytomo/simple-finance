import type { IFlow, TFlowType } from '$lib/types/flow';

export function getTotalFlowPerMonth(flows: IFlow[], type: TFlowType | null): number {
	return flows.reduce((total, flow) => {
		let amount = 0;
		if (type === null) amount = flow.type === 'in' ? flow.amount : -flow.amount;
		else amount = flow.type === type ? flow.amount : 0;

		switch (flow.repeat) {
			case 'daily':
				return total + amount * 30;
			case 'weekly':
				return total + amount * 4;
			case 'monthly':
				return total + amount;
			case 'yearly':
				return total + amount / 12;
		}
	}, 0);
}

export function getTotalFlowPerYear(flows: IFlow[], type: TFlowType | null): number {
	return flows.reduce((total, flow) => {
		let amount = 0;
		if (type === null) amount = flow.type === 'in' ? flow.amount : -flow.amount;
		else amount = flow.type === type ? flow.amount : 0;

		switch (flow.repeat) {
			case 'daily':
				return total + amount * 365;
			case 'weekly':
				return total + amount * 52;
			case 'monthly':
				return total + amount * 12;
			case 'yearly':
				return total + amount;
		}
	}, 0);
}
