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

<svelte:head>
	<title>Atur Keuangan Anda</title>
	<meta name="description" content="Aplikasi untuk mengatur keuangan Anda" />
</svelte:head>

<main
	class="min-h-screen bg-slate-100 p-4 font-sans text-slate-800 sm:p-6 lg:p-8 dark:bg-slate-900 dark:text-slate-200"
>
	<div class="mx-auto max-w-7xl">
		<header class="mb-8">
			<h1 class="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
				Atur Keuangan Anda
			</h1>
			<p class="mt-1 text-slate-600 dark:text-slate-400">
				Selamat datang! Berikut ringkasan keuangan Anda.
			</p>
		</header>

		<!-- Summary Cards Section -->
		<div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Monthly Summary -->
			<div class="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
				<h3 class="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
					Ringkasan Bulanan
				</h3>
				<div class="space-y-3">
					<p class="flex items-center justify-between">
						<span class="text-slate-500 dark:text-slate-400">Pengeluaran:</span>
						<span class="font-semibold text-red-500"
							>{formatCurrency(getTotalFlowPerMonth($flows, 'out'))}</span
						>
					</p>
					<p class="flex items-center justify-between">
						<span class="text-slate-500 dark:text-slate-400">Pendapatan:</span>
						<span class="font-semibold text-green-500"
							>{formatCurrency(getTotalFlowPerMonth($flows, 'in'))}</span
						>
					</p>
					<hr class="border-slate-200 dark:border-slate-700" />
					<p class="flex items-center justify-between text-lg">
						<span class="font-bold text-slate-800 dark:text-slate-200">Total:</span>
						<span class="font-bold text-blue-600 dark:text-blue-400"
							>{formatCurrency(getTotalFlowPerMonth($flows, null))}</span
						>
					</p>
				</div>
			</div>
			<!-- Yearly Summary -->
			<div class="rounded-xl bg-white p-6 shadow-md dark:bg-slate-800">
				<h3 class="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
					Ringkasan Tahunan
				</h3>
				<div class="space-y-3">
					<p class="flex items-center justify-between">
						<span class="text-slate-500 dark:text-slate-400">Pengeluaran:</span>
						<span class="font-semibold text-red-500"
							>{formatCurrency(getTotalFlowPerYear($flows, 'out'))}</span
						>
					</p>
					<p class="flex items-center justify-between">
						<span class="text-slate-500 dark:text-slate-400">Pendapatan:</span>
						<span class="font-semibold text-green-500"
							>{formatCurrency(getTotalFlowPerYear($flows, 'in'))}</span
						>
					</p>
					<hr class="border-slate-200 dark:border-slate-700" />
					<p class="flex items-center justify-between text-lg">
						<span class="font-bold text-slate-800 dark:text-slate-200">Total:</span>
						<span class="font-bold text-blue-600 dark:text-blue-400"
							>{formatCurrency(getTotalFlowPerYear($flows, null))}</span
						>
					</p>
				</div>
			</div>
		</div>

		<!-- Financial Records Section -->
		<section class="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
			<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<h2 class="text-2xl font-bold text-slate-900 dark:text-white">Catatan Keuangan</h2>
				<div class="flex items-center gap-2">
					{#if deletedFlow}
						<button
							on:click={deleteFlow}
							class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
						>
							Yakin Hapus?
						</button>
						<button
							on:click={cancelDeleteFlow}
							class="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none"
						>
							Batal
						</button>
					{/if}

					<select
						on:change={sortFlows}
						class="w-full rounded-lg border-slate-300 bg-white text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:w-auto dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
					>
						<option value="">Urutkan Berdasar</option>
						{#each sortOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#if $flows.length === 0}
					<p class="col-span-full py-10 text-center text-slate-500 dark:text-slate-400">
						Tidak ada catatan keuangan.
					</p>
				{/if}
				{#each $flows as flow (flow.name + flow.amount)}
					<div
						class="rounded-lg border border-slate-200 p-4 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg dark:border-slate-700 dark:hover:border-indigo-500 {flow.isActive
							? ''
							: 'bg-slate-50 opacity-70 dark:bg-slate-800/50'}"
					>
						<div class="flex items-start justify-between">
							<p class="font-bold text-slate-800 dark:text-slate-100">{flow.name}</p>
							<span
								class="text-sm font-semibold {flow.type === 'in'
									? 'text-green-600 dark:text-green-400'
									: 'text-red-600 dark:text-red-500'}"
							>
								{formatCurrency(flow.amount)}
							</span>
						</div>

						<p class="mb-4 text-sm text-slate-500 capitalize dark:text-slate-400">
							{flow.type === 'out' ? 'Pengeluaran' : 'Penghasilan'} &bull; {flow.repeat}
						</p>

						<div class="mt-2 flex flex-wrap items-center gap-2">
							<button
								on:click={() => chooseEditFlow(flow)}
								class="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
								>Edit</button
							>
							<button
								on:click={() => chooseDeleteFlow(flow)}
								class="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
								>Hapus</button
							>
							<button
								on:click={() => toggleFlow(flow)}
								class="px-3 py-1 text-xs font-medium text-white {flow.isActive
									? 'bg-yellow-500 hover:bg-yellow-600'
									: 'bg-green-500 hover:bg-green-600'} rounded-md"
							>
								{flow.isActive ? 'Nonaktifkan' : 'Aktifkan'}
							</button>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Add/Edit Form Section -->
		<section class="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
			<h2 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
				{editedFlow ? 'Edit Catatan' : 'Tambah Catatan Baru'}
			</h2>
			<div class="flex flex-col gap-4">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<input
						type="text"
						bind:value={formFlowName}
						placeholder="Nama (e.g. Gaji, Listrik)"
						class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
					/>
					<input
						type="number"
						bind:value={formFlowAmount}
						placeholder="Jumlah (e.g. 500000)"
						class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
					/>
				</div>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="flex items-center gap-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
						<span class="text-sm font-medium text-slate-600 dark:text-slate-300">Jenis:</span>
						<label for="outflow" class="flex cursor-pointer items-center gap-2 text-sm">
							<input
								type="radio"
								id="outflow"
								bind:group={formFlowType}
								value="out"
								class="text-indigo-600 focus:ring-indigo-500"
							/>
							Pengeluaran
						</label>
						<label for="inflow" class="flex cursor-pointer items-center gap-2 text-sm">
							<input
								type="radio"
								id="inflow"
								bind:group={formFlowType}
								value="in"
								class="text-indigo-600 focus:ring-indigo-500"
							/>
							Penghasilan
						</label>
					</div>
					<select
						bind:value={formFlowRepeat}
						class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
					>
						{#each repeatOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>

				<div class="mt-4 flex items-center gap-2">
					{#if editedFlow}
						<button
							on:click={editFlow}
							class="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
						>
							Simpan Perubahan
						</button>
						<button
							on:click={cancelEditFlow}
							class="rounded-lg bg-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-300 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none"
						>
							Batal
						</button>
					{:else}
						<button
							on:click={addFlow}
							class="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
						>
							Tambah Catatan
						</button>
					{/if}
				</div>
			</div>
		</section>
	</div>
</main>
