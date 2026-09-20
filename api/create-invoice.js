export default async function handler(req, res) {
    // Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { eggName, stars, userId } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Diambil dari Environment Variables Vercel

    if (!BOT_TOKEN) {
        return res.status(500).json({ error: 'Bot token not configured on server' });
    }

    // Tentukan harga dan judul berdasarkan jenis telur
    let title = "Dragonlair Egg";
    let description = `Purchase ${eggName} using Telegram Stars`;
    let amount = stars; // Jumlah Telegram Stars (misal: 15, 50, atau 220)

    try {
        // Panggil Telegram Bot API: createInvoiceLink
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                description: description,
                payload: JSON.stringify({ eggName, userId, timestamp: Date.now() }),
                currency: 'XTR', // Kode mata uang resmi untuk Telegram Stars
                prices: [{ label: eggName, amount: amount }]
            })
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ invoiceLink: data.result });
        } else {
            return res.status(400).json({ error: data.description || 'Failed to create invoice' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
      }
          
