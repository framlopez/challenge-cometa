import { Badge } from "@/src/shadcn/ui/badge";

export default function SurfaceWaterCell({ value }: { value: number }) {
	const isPositive = value > 0;

	if (isPositive) return <Badge variant="outline">Sí</Badge>;
	return <Badge variant="destructive">No</Badge>;
}
