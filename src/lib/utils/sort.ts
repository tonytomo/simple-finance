import type { IFlow } from '$lib/types/flow';

export function sortFlowByName(a: IFlow, b: IFlow) {
	return a.name.localeCompare(b.name);
}

export function sortFlowByAmount(a: IFlow, b: IFlow) {
	return b.amount - a.amount;
}

export function sortFlowByType(a: IFlow, b: IFlow) {
	return a.type.localeCompare(b.type);
}

export function sortFlowByRepeat(a: IFlow, b: IFlow) {
	return a.repeat.localeCompare(b.repeat);
}
