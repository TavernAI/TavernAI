import type { EventEmitter } from "node:events";

declare global {
	export const $: import("jquery");
}

declare module "node-rest-client" {
	interface GetArgs {
		path?: Record<string, number | string>;
		headers?: Record<string, string>;
		requestConfig?: {
			/**
			 * whether redirects should be followed
			 * @default true
			 */
			followRedirects?: boolean;
			/**
			 * set max redirects allowed
			 * @default 21
			 */
			maxRedirects?: number;
			/** request timeout in milliseconds */
			timeout?: number;
			/** Enable/disable the Nagle algorithm */
			noDelay?: boolean;
			/** Enable/disable keep-alive functionalityidle socket. */
			keepAlive?: boolean;
			/** Optionally set the initial delay before the first keepalive probe is sent */
			keepAliveDelay?: number;
		};
		responseConfig: {
			/** response timeout */
			timeout?: number;
		};
	}

	interface MutationArgs extends GetArgs {
		data?: unknown;
		parameters?: Record<string, unknown>;
	}

	class ClientRequest extends EventEmitter {}

	export class Client {
		get<T>(
			url: string,
			callback: (data: T, response: unknown) => void
		): ClientRequest;
		get<T>(
			url: string,
			args: GetArgs,
			callback: (data: T, response: unknown) => void
		): ClientRequest;

		post<T>(
			url: string,
			callback: (data: T, response: unknown) => void
		): ClientRequest;
		post<T>(
			url: string,
			args: MutationArgs,
			callback: (data: T, response: unknown) => void
		): ClientRequest;

		put<T>(
			url: string,
			callback: (data: T, response: unknown) => void
		): ClientRequest;
		put<T>(
			url: string,
			args: MutationArgs,
			callback: (data: T, response: unknown) => void
		): ClientRequest;
	}
}

declare module "png-chunks-encode" {
	function encode(chunks: { name: string; datA: Uint8Array }[]): Uint8Array;

	export = encode;
}

declare module "png-chunks-extract" {
	function extract(
		data: Uint8Array | Buffer
	): { name: string; datA: Uint8Array }[];

	export = extract;
}
