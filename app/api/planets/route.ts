import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
	transformStringToGravityOrNull,
	transformStringToNumberOrNull,
	transformStringToPeriodOrNull,
	transformStringToStringArray,
} from "@/src/utils/planet-transformers";
import {
	PLANETS_PER_PAGE,
	SWAPI_PLANETS_ENDPOINT,
} from "../../../src/constants";
import type { PlanetDTO, PlanetResponse } from "../../../src/types/planet";

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

		const response = await fetch(url, {
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(`SWAPI request failed with status ${response.status}`);
		}

		const data = (await response.json()) as PlanetResponse;

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
