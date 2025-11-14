import PageHeader from "@/src/components/page-header";
import PlanetsTable from "@/src/components/page-header/table";

export default function Home() {
	return (
		<main className="flex-1 flex flex-col">
			<PageHeader title="Planetas y cuerpos celestes" />
			<PlanetsTable />
		</main>
	);
}
