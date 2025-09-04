<script lang="ts">
	import { flows } from '$lib/stores/flow';
	import type { IFlow, TFlowRepeat, TFlowType } from '$lib/types/flow';
	import { getTotalFlowPerMonth, getTotalFlowPerYear } from '$lib/utils/flow';
	import { formatCurrency } from '$lib/utils/currency';
	import { toNumericDate, toLongDate } from '$lib/utils/date';
	import { get, store } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	const repeatOptions = [
		{ value: 'daily', label: 'Harian' },
		{ value: 'weekly', label: 'Mingguan' },
		{ value: 'monthly', label: 'Bulanan' },
		{ value: 'yearly', label: 'Tahunan' }
	];

	let newFlowName = '';
	let newFlowAmount = 0;
	let newFlowType: TFlowType = 'in';
	let newFlowRepeat: TFlowRepeat = 'daily';
	let newFlowStartAt = toNumericDate(new Date());
	let newFlowEndAt = toNumericDate(new Date());

	onMount(() => {
		$flows = get('flows') || [];
	});

	function addFlow() {
		const newFlow = {
			name: newFlowName,
			amount: newFlowAmount,
			type: newFlowType,
			startAt: newFlowStartAt.toString(),
			endAt: newFlowEndAt.toString(),
			repeat: newFlowRepeat
		};

		flows.update((flows) => [...flows, newFlow]);
		store('flows', $flows);

		newFlowName = '';
		newFlowAmount = 0;
		newFlowRepeat = 'daily';
		newFlowStartAt = toNumericDate(new Date());
		newFlowEndAt = toNumericDate(new Date());
	}

	function deleteFlow(flow: IFlow) {
		$flows = $flows.filter((b) => b !== flow);
		store('flows', $flows);
	}
</script>

<main class="p-4">
	<h1>Atur Keuangan</h1>

	<p>Pengeluaran/Bulan: {formatCurrency(getTotalFlowPerMonth($flows, 'out'))}</p>
	<p>Pendapatan/Bulan: {formatCurrency(getTotalFlowPerMonth($flows, 'in'))}</p>
	<p>Penghasilan/Bulan: {formatCurrency(getTotalFlowPerMonth($flows, null))}</p>

	<p>Pengeluaran/Tahun: {formatCurrency(getTotalFlowPerYear($flows, 'out'))}</p>
	<p>Pendapatan/Tahun: {formatCurrency(getTotalFlowPerYear($flows, 'in'))}</p>
	<p>Penghasilan/Tahun: {formatCurrency(getTotalFlowPerYear($flows, null))}</p>

	<section class="mt-4 border p-4">
		<h2>Catatan Keuangan</h2>
		{#if $flows.length === 0}
			<p>Tidak ada catatan</p>
		{/if}
		{#each $flows as flow (flow.name + flow.type)}
			<div class="mb-2 border p-2">
				<p>{flow.name}: {formatCurrency(flow.amount)}</p>
				<p>{flow.type === 'out' ? 'Pengeluaran' : 'Penghasilan'}: <i>{flow.repeat}</i></p>
				<p>Dari <b>{toLongDate(flow.startAt)}</b> hingga <b>{toLongDate(flow.endAt)}</b></p>
				<button on:click={() => deleteFlow(flow)}>Hapus</button>
			</div>
		{/each}
	</section>

	<section class="mt-4 border p-4">
		<h2>Tambah Pengeluaran/Penghasilan Berulang</h2>
		<div class="flex flex-col items-start gap-2">
			<input type="text" bind:value={newFlowName} placeholder="Nama" />
			<input type="number" bind:value={newFlowAmount} placeholder="Jumlah" />
			<div class="flex gap-4">
				<label for="outflow">
					<input type="radio" id="outflow" bind:group={newFlowType} value="outflow" />
					Pengeluaran
				</label>
				<label for="inflow">
					<input type="radio" id="inflow" bind:group={newFlowType} value="inflow" />
					Penghasilan
				</label>
			</div>
			<select bind:value={newFlowRepeat}>
				{#each repeatOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
			<input type="date" bind:value={newFlowStartAt} />
			<input type="date" bind:value={newFlowEndAt} />
			<button on:click={addFlow}>Tambah</button>
		</div>
	</section>
</main>
