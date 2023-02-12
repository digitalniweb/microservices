/**
 *
 * @param ms number of milliseconds to wait. Default 1000
 * @returns Promise<void>
 */
export default function sleep(ms = 1000): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
