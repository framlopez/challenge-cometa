import PageHeader from "@/src/components/page-header";
import PlanetsTable from "@/src/components/page-header/table";

export default function Home() {
	return (
		<main className="min-h-screen bg-white">
			<div className="w-full">
				<PageHeader title="Planetas y cuerpos celestes" />
				<PlanetsTable />
			</div>
		</main>
	);
}
