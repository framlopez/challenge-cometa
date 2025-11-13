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

