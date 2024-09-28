export async function POST(req: Request) {
    const { tokenId } = await req.json();

    console.log(tokenId);

    if (!tokenId) return new Response('No tokenId', { status: 400 });

    try {
        const response = await fetch(`${process.env.FT_API_ENDPOINT}/card/${tokenId}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.FT_API_KEY as string,
            },
        });
        const card = await response.json();

        return new Response(JSON.stringify(card), { status: 200 });
    } catch (error) {
        return new Response(null, { status: 500 });
    }
}
