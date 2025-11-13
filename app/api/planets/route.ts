import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SWAPI_PLANETS_ENDPOINT = "https://swapi.py4e.com/api/planets/";
const PLANETS_PER_PAGE = 10;

function transformStringToNumberOrNull(value: string): number | null {
	if (value === "unknown") return null;

	const valueNum = Number.parseFloat(value);
	if (Number.isNaN(valueNum)) return null;

	return valueNum;
}

function transformStringToPeriodOrNull(
	value: string,
): { days: number; hours: number } | null {
	if (value === "unknown") return null;

	const valueNum = Number.parseFloat(value);
	if (Number.isNaN(valueNum)) return null;

	const days = Math.floor(valueNum / 24);
	const hours = valueNum % 24;
	return { days, hours };
}

const GRAVITY_CONSTANT = 9.8;
function transformStringToGravityOrNull(value: string): number | null {
	if (value === "unknown") return null;

	const [number] = value.split(" ");

	const valueNum = Number.parseFloat(number);
	if (Number.isNaN(valueNum)) return null;

	return valueNum * GRAVITY_CONSTANT;
}

function transformStringToStringArray(value: string): string[] {
	if (value === "unknown") return [];

	const items = value.split(",");
	if (items.length === 0) return [];

	return items;
}

type SwapiPlanet = {
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

type PlanetResponse = {
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

export async function GET(request: NextRequest) {
	const pageParam = request.nextUrl.searchParams.get("page");
	const page = pageParam ? Number.parseInt(pageParam, 10) : 1;

	if (Number.isNaN(page) || page < 1) {
		return NextResponse.json(
			{ error: "El parámetro page debe ser un número positivo." },
			{ status: 400 },
		);
	}

	try {
		const url = new URL(SWAPI_PLANETS_ENDPOINT);
		url.searchParams.set("page", String(page));

		const response = await fetch(url, { cache: "no-store" });

		if (!response.ok) {
			throw new Error(`SWAPI request failed with status ${response.status}`);
		}

		const data: PlanetResponse = await response.json();

		const items: PlanetDTO[] = data.results.map((planet) => {
			return {
				name: planet.name,
				climate: transformStringToStringArray(planet.climate),
				terrain: transformStringToStringArray(planet.terrain),
				gravity: transformStringToGravityOrNull(planet.gravity),
				diameter: transformStringToNumberOrNull(planet.diameter),
				rotationPeriod: transformStringToPeriodOrNull(planet.rotation_period),
				surfaceWater: transformStringToNumberOrNull(planet.surface_water),
				population: transformStringToNumberOrNull(planet.population),
				residents: planet.residents.length,
				films: planet.films.length,
			};
		});

		return NextResponse.json({
			data: items,
			pagination: {
				totalItems: data.count,
				perPage: PLANETS_PER_PAGE,
				page,
			},
		});
	} catch (error) {
		console.error("Error fetching planets from SWAPI", error);
		return NextResponse.json(
			{ error: "No se pudo obtener la información de los planetas." },
			{ status: 502 },
		);
	}
}
