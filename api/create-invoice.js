export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { title, description, amount } = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN; // Ambil dari Environment Variables Vercel

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                description: description,
                payload: `order_${Date.now()}`,
                provider_token: "", // Kosongkan string jika menggunakan Telegram Stars (Digital Goods)
                currency: "XTR",     // XTR adalah mata uang resmi untuk Telegram Stars
                prices: [{ label: title, amount: amount }] // Nilai amount dalam Stars (contoh: 15 untuk 15 Stars)
            })
        });

        const data = await response.json();
        if (!data.ok) {
            throw new Error(data.description || 'Gagal membuat invoice Telegram');
        }

        return res.status(200).json({ invoiceLink: data.result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
