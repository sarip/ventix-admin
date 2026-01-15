export default async function handler(req, res) {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch file');

        const buffer = Buffer.from(await response.arrayBuffer());
        const fileName = decodeURIComponent((url as string).split('/').pop() || 'file');
        res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch file' });
    }
}
