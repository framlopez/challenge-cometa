/**
 * Constante para convertir la gravedad estándar de SWAPI a m/s²
 * SWAPI usa "1 standard" = 1x la gravedad terrestre (9.8 m/s²)
 */
const GRAVITY_CONSTANT = 9.8;

/**
 * Transforma un string a número o null si es "unknown" o inválido
 */
export function transformStringToNumberOrNull(value: string): number | null {
	if (value === "unknown") return null;

	const valueNum = Number.parseFloat(value);
	if (Number.isNaN(valueNum)) return null;

	return valueNum;
}

/**
 * Transforma un string de período de rotación (en horas) a un objeto con días y horas
 * o null si es "unknown" o inválido
 */
export function transformStringToPeriodOrNull(
	value: string,
): { days: number; hours: number } | null {
	if (value === "unknown") return null;

	const valueNum = Number.parseFloat(value);
	if (Number.isNaN(valueNum)) return null;

	const days = Math.floor(valueNum / 24);
	const hours = valueNum % 24;
	return { days, hours };
}

/**
 * Transforma un string de gravedad (ej: "1 standard") a m/s²
 * o null si es "unknown" o inválido
 */
export function transformStringToGravityOrNull(value: string): number | null {
	if (value === "unknown") return null;

	const [number] = value.split(" ");

	const valueNum = Number.parseFloat(number);
	if (Number.isNaN(valueNum)) return null;

	return valueNum * GRAVITY_CONSTANT;
}

/**
 * Transforma un string separado por comas a un array de strings
 * Retorna array vacío si es "unknown" o no tiene items
 */
export function transformStringToStringArray(value: string): string[] {
	if (value === "unknown") return [];

	const items = value.split(",");
	if (items.length === 0) return [];

	return items;
}

/**
 * Mapeo de climas de inglés a español
 */
const CLIMATE_MAP: Record<string, string> = {
	arid: "árido",
	artic: "ártico",
	"artificial temperate": "templado artificial",
	frigid: "frígido",
	frozen: "congelado",
	hot: "caliente",
	humid: "húmedo",
	moist: "húmedo",
	murky: "turbio",
	polluted: "contaminado",
	rocky: "rocoso",
	subartic: "subártico",
	superheated: "sobrecalentado",
	temperate: "templado",
	tropical: "tropical",
	windy: "ventoso",
};

/**
 * Mapeo de terrenos de inglés a español
 */
const TERRAIN_MAP: Record<string, string> = {
	"acid pools": "lagos ácidos",
	"airless asteroid": "asteroide sin aire",
	ash: "ceniza",
	barren: "estéril",
	bogs: "pantanos",
	canyons: "cañones",
	caves: "cuevas",
	cities: "ciudades",
	cityscape: "paisaje urbano",
	cliffs: "acantilados",
	desert: "desierto",
	deserts: "desiertos",
	fields: "campos",
	forests: "bosques",
	"fungus forests": "bosques de hongos",
	"gas giant": "gigante gaseoso",
	glaciers: "glaciares",
	grass: "hierba",
	grasslands: "praderas",
	"grassy hills": "colinas herbosas",
	hills: "colinas",
	"ice canyons": "cañones de hielo",
	"ice caves": "cuevas de hielo",
	islands: "islas",
	jungle: "jungla",
	jungles: "junglas",
	lakes: "lagos",
	"lava rivers": "ríos de lava",
	mesas: "mesas",
	mountain: "montaña",
	"mountain ranges": "cordilleras",
	mountains: "montañas",
	ocean: "océano",
	oceans: "océanos",
	plains: "llanuras",
	plateaus: "mesetas",
	rainforests: "selvas",
	reefs: "arrecifes",
	rivers: "ríos",
	rock: "roca",
	"rock arches": "arcos de roca",
	rocky: "rocoso",
	"rocky canyons": "cañones rocosos",
	"rocky deserts": "desiertos rocosos",
	"rocky islands": "islas rocosas",
	savanna: "sabana",
	savannahs: "sabanas",
	savannas: "sabanas",
	scrublands: "matorrales",
	seas: "mares",
	sinkholes: "sumideros",
	swamp: "pantano",
	swamps: "pantanos",
	"toxic cloudsea": "mar de nubes tóxicas",
	tundra: "tundra",
	urban: "urbano",
	valleys: "valles",
	verdant: "verde",
	vines: "enredaderas",
	volcanoes: "volcanes",
};

/**
 * Transforma un array de strings de clima a sus traducciones en español
 * Si un valor no tiene traducción, retorna el valor original
 */
export function transformClimateToStringArray(value: string): string[] {
	if (value === "unknown") return [];

	const items = value.split(",").map((item) => item.trim());
	if (items.length === 0) return [];

	return items.map((item) => CLIMATE_MAP[item.toLowerCase()] || item);
}

/**
 * Transforma un array de strings de terreno a sus traducciones en español
 * Si un valor no tiene traducción, retorna el valor original
 */
export function transformTerrainToStringArray(value: string): string[] {
	if (value === "unknown") return [];

	const items = value.split(",").map((item) => item.trim());
	if (items.length === 0) return [];

	return items.map((item) => TERRAIN_MAP[item.toLowerCase()] || item);
}
