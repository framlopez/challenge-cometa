import formatNumberWithCommas from "@/src/utils/format-number";

export default function PopulationCell({ value }: { value: number }) {
	const formattedValue = formatNumberWithCommas(value);
	return (
		<span className="text-sm font-normal text-[#697086]">{formattedValue}</span>
	);
}
