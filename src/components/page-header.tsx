export default function PageHeader({ title }: { title: string }) {
	return (
		<div className="px-8 py-6">
			<h1 className="text-3xl font-semibold leading-none">{title}</h1>
		</div>
	);
}
