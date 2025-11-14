import { Badge } from "@/src/shadcn/ui/badge";

export default function TerrainCell({ value }: { value: string[] }) {
	// Workaround para renderizar el primer elemento
	// TODO: Resolver la experiencia para poder presentar todos los elementos
	const truncatedValue = value.slice(0, 1);

	return (
		<div className="flex flex-wrap gap-1">
			{truncatedValue.map((item) => (
				<Badge
					className="bg-[#F3EBFF] capitalize text-[#873AFF]"
					variant="secondary"
					key={item}
				>
					{item}
				</Badge>
			))}
		</div>
	);
}
