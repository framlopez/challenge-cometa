import { NextResponse } from "next/server";

const SWAPI_PLANETS_ENDPOINT = "https://swapi.py4e.com/api/planets/";

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
  next: string | null;
  results: SwapiPlanet[];
};

type PlanetDTO = Pick<
  SwapiPlanet,
  | "name"
  | "climate"
  | "terrain"
  | "gravity"
  | "diameter"
  | "rotation_period"
  | "orbital_period"
  | "surface_water"
  | "population"
  | "residents"
  | "films"
>;

async function fetchAllPlanets(): Promise<PlanetDTO[]> {
  const planets: PlanetDTO[] = [];
  let nextUrl: string | null = SWAPI_PLANETS_ENDPOINT;

  while (nextUrl) {
    const response = await fetch(nextUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`SWAPI request failed with status ${response.status}`);
    }

    const data: PlanetResponse = await response.json();

    data.results.forEach((planet) => {
      planets.push({
        name: planet.name,
        climate: planet.climate,
        terrain: planet.terrain,
        gravity: planet.gravity,
        diameter: planet.diameter,
        rotation_period: planet.rotation_period,
        orbital_period: planet.orbital_period,
        surface_water: planet.surface_water,
        population: planet.population,
        residents: planet.residents,
        films: planet.films,
      });
    });

    nextUrl = data.next;
  }

  return planets;
}

export async function GET() {
  try {
    const planets = await fetchAllPlanets();
    return NextResponse.json({ data: planets });
  } catch (error) {
    console.error("Error fetching planets from SWAPI", error);
    return NextResponse.json(
      { error: "No se pudo obtener la información de los planetas." },
      { status: 502 },
    );
  }
}

