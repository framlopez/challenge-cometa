import type { ColumnDef } from "@tanstack/react-table";
import type { PlanetDTO } from "@/app/api/planets/route";
import { Checkbox } from "@/src/shadcn/ui/checkbox";
import ClimateCell from "./cells/climate-cell";
import DiameterCell from "./cells/diameter-cell";
import FilmsCell from "./cells/films-cell";
import GravityCell from "./cells/gravity-cell";
import NameCell from "./cells/name-cell";
import PopulationCell from "./cells/population-cell";
import ResidentsCell from "./cells/residents-cell";
import RotationPeriodCell from "./cells/rotation-period-cell";
import SurfaceWaterCell from "./cells/surface-water-cell";
import TerrainCell from "./cells/terrain-cell";
import UnknownCell from "./cells/unknown-cell";

const columns: ColumnDef<PlanetDTO>[] = [
	{
		id: "select",
		enableSorting: false,
		enableHiding: false,
		size: 56,
		header: ({ table }) => {
			const isAllSelected = table.getIsAllPageRowsSelected();
			const isSomeSelected = table.getIsSomePageRowsSelected();

			return (
				<Checkbox
					checked={isSomeSelected ? "indeterminate" : isAllSelected}
					onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
				/>
			);
		},
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(v) => row.toggleSelected(!!v)}
			/>
		),
	},
	{
		accessorKey: "name",
		header: "Nombre",
		size: 137,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["name"]>();
			return <NameCell value={value} />;
		},
	},
	{
		accessorKey: "climate",
		header: "Clima",
		size: 143,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["climate"]>();
			return <ClimateCell value={value} />;
		},
	},
	{
		accessorKey: "terrain",
		header: "Terreno",
		size: 127,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["terrain"]>();
			return <TerrainCell value={value} />;
		},
	},
	{
		accessorKey: "gravity",
		header: "Gravedad",
		size: 150,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["gravity"]>();
			if (value === null) return <UnknownCell />;
			return <GravityCell value={value} />;
		},
	},
	{
		accessorKey: "diameter",
		header: "Diámetro (km)",
		size: 175,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["diameter"]>();
			if (value === null) return <UnknownCell />;
			return <DiameterCell value={value} />;
		},
	},
	{
		accessorKey: "rotationPeriod",
		header: "Periodo de rotación",
		size: 175,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["rotationPeriod"]>();
			if (value === null) return <UnknownCell />;
			return <RotationPeriodCell days={value.days} hours={value.hours} />;
		},
	},
	{
		accessorKey: "surfaceWater",
		header: "Agua superficial",
		size: 128,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["surfaceWater"]>();
			if (value === null) return <UnknownCell />;
			return <SurfaceWaterCell value={value} />;
		},
	},
	{
		accessorKey: "population",
		header: "Población",
		size: 170,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["population"]>();
			if (value === null) return <UnknownCell />;
			return <PopulationCell value={value} />;
		},
	},
	{
		accessorKey: "residents",
		header: "Residentes",
		size: 158,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["residents"]>();
			return <ResidentsCell value={value} />;
		},
	},
	{
		accessorKey: "films",
		header: "Películas",
		size: 112,
		cell: (info) => {
			const value = info.getValue<PlanetDTO["films"]>();
			return <FilmsCell value={value} />;
		},
	},
];

export default columns;
