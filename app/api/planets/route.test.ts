import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mock de NextRequest
function createMockRequest(url: string): NextRequest {
	return {
		nextUrl: new URL(url, "http://localhost:3000"),
	} as NextRequest;
}

describe("GET /api/planets", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Asegurar que fetch esté disponible
		if (typeof global.fetch === "undefined") {
			global.fetch = vi.fn();
		}
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("debe retornar planetas con datos transformados correctamente", async () => {
		const mockPlanetResponse = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					name: "Tatooine",
					climate: "arid",
					terrain: "desert",
					gravity: "1 standard",
					diameter: "10465",
					rotation_period: "23",
					orbital_period: "304",
					surface_water: "1",
					population: "200000",
					residents: ["https://swapi.py4e.com/api/people/1/"],
					films: ["https://swapi.py4e.com/api/films/1/"],
				},
			],
		};

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPlanetResponse,
		});

		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=1",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.data).toHaveLength(1);
		expect(data.data[0]).toEqual({
			name: "Tatooine",
			climate: ["arid"],
			terrain: ["desert"],
			gravity: 9.8, // 1 * 9.8
			diameter: 10465,
			rotationPeriod: { days: 0, hours: 23 },
			surfaceWater: 1,
			population: 200000,
			residents: 1,
			films: 1,
		});
		expect(data.pagination).toEqual({
			totalItems: 1,
			perPage: 10,
			page: 1,
		});
	});

	it("debe manejar valores 'unknown' correctamente", async () => {
		const mockPlanetResponse = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					name: "Unknown Planet",
					climate: "unknown",
					terrain: "unknown",
					gravity: "unknown",
					diameter: "unknown",
					rotation_period: "unknown",
					orbital_period: "unknown",
					surface_water: "unknown",
					population: "unknown",
					residents: [],
					films: [],
				},
			],
		};

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPlanetResponse,
		});

		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=1",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.data[0]).toEqual({
			name: "Unknown Planet",
			climate: [],
			terrain: [],
			gravity: null,
			diameter: null,
			rotationPeriod: null,
			surfaceWater: null,
			population: null,
			residents: 0,
			films: 0,
		});
	});

	it("debe transformar rotation_period a días y horas correctamente", async () => {
		const mockPlanetResponse = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					name: "Test Planet",
					climate: "temperate",
					terrain: "grasslands",
					gravity: "1 standard",
					diameter: "12500",
					rotation_period: "25", // 1 día y 1 hora
					orbital_period: "365",
					surface_water: "40",
					population: "1000000",
					residents: [],
					films: [],
				},
			],
		};

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPlanetResponse,
		});

		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=1",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(data.data[0].rotationPeriod).toEqual({ days: 1, hours: 1 });
	});

	it("debe transformar gravity correctamente (multiplicando por constante)", async () => {
		const mockPlanetResponse = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					name: "Test Planet",
					climate: "temperate",
					terrain: "grasslands",
					gravity: "2 standard", // 2 * 9.8 = 19.6
					diameter: "12500",
					rotation_period: "24",
					orbital_period: "365",
					surface_water: "40",
					population: "1000000",
					residents: [],
					films: [],
				},
			],
		};

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPlanetResponse,
		});

		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=1",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(data.data[0].gravity).toBe(19.6);
	});

	it("debe transformar arrays de climate y terrain correctamente", async () => {
		const mockPlanetResponse = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					name: "Test Planet",
					climate: "temperate, tropical",
					terrain: "jungle, rainforests",
					gravity: "1 standard",
					diameter: "12500",
					rotation_period: "24",
					orbital_period: "365",
					surface_water: "40",
					population: "1000000",
					residents: [],
					films: [],
				},
			],
		};

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPlanetResponse,
		});

		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=1",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(data.data[0].climate).toEqual(["temperate", " tropical"]);
		expect(data.data[0].terrain).toEqual(["jungle", " rainforests"]);
	});

	it("debe usar page=1 por defecto cuando no se proporciona el parámetro", async () => {
		const mockPlanetResponse = {
			count: 1,
			next: null,
			previous: null,
			results: [],
		};

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPlanetResponse,
		});

		const request = createMockRequest("http://localhost:3000/api/planets");
		const response = await GET(request);
		const data = await response.json();

		expect(global.fetch).toHaveBeenCalled();
		const fetchCall = vi.mocked(global.fetch).mock.calls[0];
		const url = fetchCall[0] as URL;
		expect(url.toString()).toContain("page=1");
		expect(data.pagination.page).toBe(1);
	});

	it("debe retornar error 400 cuando page no es un número", async () => {
		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=abc",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.error).toBe("El parámetro page debe ser un número positivo.");
	});

	it("debe retornar error 400 cuando page es negativo", async () => {
		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=-1",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.error).toBe("El parámetro page debe ser un número positivo.");
	});

	it("debe retornar error 400 cuando page es cero", async () => {
		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=0",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.error).toBe("El parámetro page debe ser un número positivo.");
	});

	it("debe retornar error 502 cuando la API externa falla", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
		});

		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=1",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(response.status).toBe(502);
		expect(data.error).toBe(
			"No se pudo obtener la información de los planetas.",
		);
	});

	it("debe retornar error 502 cuando hay un error en el fetch", async () => {
		global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=1",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(response.status).toBe(502);
		expect(data.error).toBe(
			"No se pudo obtener la información de los planetas.",
		);
	});

	it("debe contar correctamente residents y films", async () => {
		const mockPlanetResponse = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					name: "Test Planet",
					climate: "temperate",
					terrain: "grasslands",
					gravity: "1 standard",
					diameter: "12500",
					rotation_period: "24",
					orbital_period: "365",
					surface_water: "40",
					population: "1000000",
					residents: [
						"https://swapi.py4e.com/api/people/1/",
						"https://swapi.py4e.com/api/people/2/",
						"https://swapi.py4e.com/api/people/3/",
					],
					films: [
						"https://swapi.py4e.com/api/films/1/",
						"https://swapi.py4e.com/api/films/2/",
					],
				},
			],
		};

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPlanetResponse,
		});

		const request = createMockRequest(
			"http://localhost:3000/api/planets?page=1",
		);
		const response = await GET(request);
		const data = await response.json();

		expect(data.data[0].residents).toBe(3);
		expect(data.data[0].films).toBe(2);
	});
});
