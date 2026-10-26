import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const auth = await getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'Judul dan isi pesan wajib diisi' }, { status: 400 });
    }

    const users = await db.query('SELECT DISTINCT email FROM users WHERE email IS NOT NULL');
    const emailList = users.rows.map(u => u.email).filter(Boolean);

    if (emailList.length === 0) {
      return NextResponse.json({ error: 'Tidak ada email pembeli ditemukan' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const siteUrl = process.env.SITE_URL || 'https://toko-robloxrehan10.vercel.app';

    await transporter.sendMail({
      from: `"Toko Rehan Roblox" <${process.env.GMAIL_USER}>`,
      bcc: emailList,
      subject: `📢 [PROMO EXCLUSIVE] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #04080f; color: #ffffff; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #071420; border: 1px solid #00f0ff; border-radius: 12px; padding: 24px; box-shadow: 0 0 20px rgba(0, 240, 255, 0.2); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(0, 240, 255, 0.3); }
            .brand { font-size: 24px; font-weight: 900; color: #00f0ff; letter-spacing: 2px; }
            .title { color: #39ff88; font-size: 18px; font-weight: bold; margin-top: 20px; }
            .content { font-size: 14px; color: #cbd5e1; line-height: 1.7; white-space: pre-line; margin: 15px 0 25px; }
            .btn { display: inline-block; background: linear-gradient(90deg, #00f0ff 0%, #0099ff 100%); color: #000000; font-weight: 800; padding: 12px 28px; border-radius: 8px; text-decoration: none; text-align: center; }
            .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="brand">🤖 TOKO REHAN ROBLOX</div>
            </div>
            <div class="title">${subject}</div>
            <div class="content">${message}</div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${siteUrl}" class="btn">🚀 CEK STOK & LELANG SEKARANG</a>
            </div>
            <div class="footer">
              Email ini dikirim otomatis oleh sistem Toko Rehan Roblox.<br>
              © 2026 Toko Rehan. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      totalSent: emailList.length, 
      message: `Berhasil mengirim broadcast ke ${emailList.length} pelanggan!` 
    });

  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: 'Gagal mengirim email broadcast' }, { status: 500 });
  }
}
