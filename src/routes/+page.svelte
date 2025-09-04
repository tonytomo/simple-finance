<script lang="ts">
	import { flows } from '$lib/stores/flow';
	import type { IFlow, TFlowRepeat, TFlowType } from '$lib/types/flow';
	import { getTotalFlowPerMonth, getTotalFlowPerYear } from '$lib/utils/flow';
	import { formatCurrency } from '$lib/utils/currency';
	import { get, store } from '$lib/utils/storage';
	import { onMount } from 'svelte';
	import {
		sortFlowByAmount,
		sortFlowByName,
		sortFlowByType,
		sortFlowByRepeat
	} from '$lib/utils/sort';
	import type { TSortBy } from '$lib/types/sort';

	const sortOptions = [
		{ value: 'amount', label: 'Jumlah' },
		{ value: 'name', label: 'Nama' },
		{ value: 'type', label: 'Tipe' },
		{ value: 'repeat', label: 'Periode' }
	];

	const repeatOptions = [
		{ value: 'daily', label: 'Harian' },
		{ value: 'weekly', label: 'Mingguan' },
		{ value: 'monthly', label: 'Bulanan' },
		{ value: 'yearly', label: 'Tahunan' }
	];

	let deletedFlow: IFlow | null = null;
	let editedFlow: IFlow | null = null;
	let formFlowName = '';
	let formFlowAmount = 0;
	let formFlowType: TFlowType = 'in';
	let formFlowRepeat: TFlowRepeat = 'daily';

	onMount(() => {
		$flows = get('flows') || [];
	});

	function sortFlows(e: Event) {
		const sortBy = (e.target as HTMLSelectElement).value as TSortBy;
		$flows = $flows.sort((a, b) => {
			switch (sortBy) {
				case 'amount':
					return sortFlowByAmount(a, b);
				case 'name':
					return sortFlowByName(a, b);
				case 'type':
					return sortFlowByType(a, b);
				case 'repeat':
					return sortFlowByRepeat(a, b);
				default:
					return 0;
			}
		});
	}

	function chooseEditFlow(flow: IFlow) {
		editedFlow = flow;
		formFlowName = flow.name;
		formFlowAmount = flow.amount;
		formFlowType = flow.type;
		formFlowRepeat = flow.repeat;
	}

	function cancelEditFlow() {
		editedFlow = null;
		formFlowName = '';
		formFlowAmount = 0;
		formFlowRepeat = 'daily';
	}

	function editFlow() {
		const formFlow = {
			name: formFlowName,
			amount: formFlowAmount,
			type: formFlowType,
			repeat: formFlowRepeat,
			isActive: true
		};

		$flows = $flows.map((f) => (f === editedFlow ? formFlow : f));
		store('flows', $flows);

		editedFlow = null;
		formFlowName = '';
		formFlowAmount = 0;
		formFlowRepeat = 'daily';
	}

	function addFlow() {
		const formFlow = {
			name: formFlowName,
			amount: formFlowAmount,
			type: formFlowType,
			repeat: formFlowRepeat,
			isActive: true
		};

		flows.update((flows) => [...flows, formFlow]);
		store('flows', $flows);

		formFlowName = '';
		formFlowAmount = 0;
		formFlowRepeat = 'daily';
	}

	function toggleFlow(flow: IFlow) {
		$flows = $flows.map((f) => (f === flow ? { ...f, isActive: !f.isActive } : f));
		store('flows', $flows);
	}

	function chooseDeleteFlow(flow: IFlow) {
		deletedFlow = flow;
	}

	function cancelDeleteFlow() {
		deletedFlow = null;
	}

	function deleteFlow() {
		$flows = $flows.filter((f) => f !== deletedFlow);
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
		<div class="mb-4 flex items-start justify-between">
			<h2>Catatan Keuangan</h2>
			<div class="flex items-center gap-2">
				{#if deletedFlow}
					<button on:click={deleteFlow}>Yakin untuk menghapus?</button>
					<button on:click={cancelDeleteFlow}>Batal</button>
				{/if}

				<select on:change={sortFlows}>
					<option value="">Urutkan</option>
					{#each sortOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="flex flex-wrap gap-2">
			{#if $flows.length === 0}
				<p>Tidak ada catatan</p>
			{/if}
			{#each $flows as flow (flow.name + flow.type)}
				<div class="mb-2 border p-2 {flow.isActive ? '' : 'bg-gray-200'}">
					<p><b>{flow.name}</b>: {formatCurrency(flow.amount)}</p>
					<p><b>{flow.type === 'out' ? 'Pengeluaran' : 'Penghasilan'}:</b> <i>{flow.repeat}</i></p>
					<div class="mt-2 flex items-center gap-2">
						<button on:click={() => chooseEditFlow(flow)}>Edit</button>
						<button on:click={() => chooseDeleteFlow(flow)}>Hapus</button>
						<button on:click={() => toggleFlow(flow)}>
							{flow.isActive ? 'Nonaktifkan' : 'Aktifkan'}
						</button>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="mt-4 border p-4">
		<h2>
			{editedFlow ? 'Edit' : 'Tambah'}
			Pengeluaran/Penghasilan Berulang
		</h2>
		<div class="flex flex-col items-start gap-4">
			<div class="flex flex-wrap gap-4">
				<input type="text" bind:value={formFlowName} placeholder="Nama" />
				<input type="number" bind:value={formFlowAmount} placeholder="Jumlah" />
				<div class="flex gap-4">
					<label for="outflow">
						<input type="radio" id="outflow" bind:group={formFlowType} value="out" />
						Pengeluaran
					</label>
					<label for="inflow">
						<input type="radio" id="inflow" bind:group={formFlowType} value="in" />
						Penghasilan
					</label>
				</div>
				<select bind:value={formFlowRepeat}>
					{#each repeatOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
			<div class="flex items-center gap-2">
				{#if editedFlow}
					<button on:click={editFlow}>Edit Catatan</button>
					<button on:click={cancelEditFlow}>Batal</button>
				{:else}
					<button on:click={addFlow}>Tambah Catatan</button>
				{/if}
			</div>
		</div>
	</section>
</main>
