
async function test() {
    // Try .png extension
    const url = 'https://placehold.co/500x300/800000/fff.png?text=Imagem+Demo';
    try {
        const res = await fetch(url);
        console.log('Fetching', url);
        console.log('Status:', res.status);
        if (res.ok) {
            const buf = await res.arrayBuffer();
            const header = new Uint8Array(buf.slice(0, 4));
            console.log('Header:', header);
            // PNG signature: 89 50 4E 47
            if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
                console.log('Confirmed PNG');
            } else {
                console.log('Not a PNG');
                // Check for SVG <svg
                // 3C 73 76 67
                if (header[0] === 0x3C) console.log('Likely SVG');
            }
        }
    } catch (e) {
        console.error(e);
    }
}
test();
