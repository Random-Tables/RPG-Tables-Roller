console.log("HOOKS");
export async function handle({ event /* previously: request */, resolve }) {
	const response = await resolve(event, {
		ssr: false
	});
	return response;
}