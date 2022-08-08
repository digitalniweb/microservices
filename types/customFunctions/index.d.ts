export type stripUndefined<T> = {
	[P in keyof T]-?: T[P];
};
