export type SwapiPlanet = {
	name: string;
	climate: string;
	terrain: string;
	gravity: string;
	diameter: string;
	rotation_period: string;
	orbital_period: string;
	surface_water: string;
	population: string;
	residents: string[];
	films: string[];
};

export type PlanetResponse = {
	count: number;
	next: string | null;
	previous: string | null;
	results: SwapiPlanet[];
};

export type PlanetDTO = {
	name: string;
	climate: string[];
	terrain: string[];
	gravity: number | null;
	diameter: number | null;
	rotationPeriod: { days: number; hours: number } | null;
	surfaceWater: number | null;
	population: number | null;
	residents: number;
	films: number;
};

