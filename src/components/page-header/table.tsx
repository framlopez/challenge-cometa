"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/src/shadcn/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/shadcn/ui/table";
import type { PlanetDTO } from "@/src/types/planet";
import columns from "./columns";

type PlanetsResponse = {
	data: PlanetDTO[];
	pagination: {
		totalItems: number;
		perPage: number;
		page: number;
	};
};

export default function PlanetsTable() {
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	const {
		data: planetsData,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		isPending,
	} = useInfiniteQuery<PlanetsResponse, Error>({
		queryKey: ["planets"],
		queryFn: async ({ pageParam = 1 }): Promise<PlanetsResponse> => {
			const currentPage = Number.isNaN(pageParam) ? 1 : pageParam;

			const response = await fetch(`/api/planets?page=${currentPage}`);

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}

			const data = (await response.json()) as
				| PlanetsResponse
				| { error?: string };

			if ("error" in data) {
				throw new Error(data.error);
			}

			return data as PlanetsResponse;
		},
		initialPageParam: 1,
		getNextPageParam: ({ pagination }) => {
			const { totalItems, page, perPage } = pagination;
			const totalPages = Math.ceil(totalItems / perPage);
			if (page < totalPages) return page + 1;
			return undefined;
		},
	});

	useEffect(() => {
		const target = loadMoreRef.current;

		if (!target || !hasNextPage) {
			return undefined;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];

				if (entry.isIntersecting && !isFetchingNextPage) {
					void fetchNextPage();
				}
			},
			{
				root: null,
				rootMargin: "1024px 0px",
				threshold: 0,
			},
		);

		observer.observe(target);

		return () => {
			observer.disconnect();
		};
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const data = useMemo(
		() => planetsData?.pages.flatMap((page) => page.data) ?? [],
		[planetsData],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: { rowSelection },
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
	});

	const isEmpty = !isPending && !error && data.length === 0;

	return (
		<div className="flow-root">
			<div>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										style={{
											width: header.getSize(),
											minWidth: header.getSize(),
											maxWidth: header.getSize(),
										}}
									>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isPending
							? Array.from({ length: 10 }, (_, rowIndex) => {
									const rowId = `skeleton-row-${rowIndex}`;
									return (
										<TableRow key={rowId}>
											{columns.map((column, colIndex) => {
												const columnId =
													"id" in column
														? column.id
														: "accessorKey" in column
															? column.accessorKey
															: `col-${colIndex}`;
												const isCheckboxColumn = columnId === "select";
												return (
													<TableCell
														style={{
															width: column.size ?? 100,
															minWidth: column.size ?? 100,
															maxWidth: column.size ?? 100,
														}}
														key={`${rowId}-${columnId}`}
													>
														{isCheckboxColumn ? (
															<Skeleton className="h-4 w-4" />
														) : (
															<Skeleton className="w-2/3 h-[22px]" />
														)}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})
							: null}

						{!isPending && data.length > 0
							? table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												style={{
													width: cell.column.getSize(),
													minWidth: cell.column.getSize(),
													maxWidth: cell.column.getSize(),
												}}
												key={cell.id}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							: null}
					</TableBody>
				</Table>

				<div ref={loadMoreRef} className="h-1 w-full" />

				{error ? (
					<div className="px-4 py-6 text-sm text-red-600 sm:px-6 lg:px-8">
						Ocurrió un error al cargar los planetas. Intentá nuevamente más
						tarde.
					</div>
				) : null}

				{isEmpty ? (
					<div className="px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
						No encontramos planetas para mostrar en este momento.
					</div>
				) : null}

				{isFetching && data.length > 0 && !isFetchingNextPage ? (
					<div className="px-4 py-4 text-center text-xs uppercase tracking-wide text-indigo-600 sm:px-6 lg:px-8">
						Actualizando datos...
					</div>
				) : null}

				{isFetchingNextPage ? (
					<div className="px-4 py-4 text-center text-xs uppercase tracking-wide text-indigo-600 sm:px-6 lg:px-8">
						Cargando más planetas...
					</div>
				) : null}
			</div>
		</div>
	);
}
