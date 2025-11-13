/// <reference types="vitest/globals" />

import { vi } from "vitest";

declare global {
	// eslint-disable-next-line no-var
	var fetch: typeof globalThis.fetch;
}

