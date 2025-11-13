export default function RotationPeriodCell({
	days,
	hours,
}: {
	days: number;
	hours: number;
}) {
	return (
		<span className="text-sm font-normal text-[#697086]">
			{days > 0 && `${days} d `}
			{hours > 0 && `${hours} hs`}
		</span>
	);
}
