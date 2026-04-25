import type { Request, Response } from 'express'
import prisma from '../utils/prisma'

export async function getPublicForm(req: Request, res: Response) {
  const form = await prisma.form.findUnique({ where: { id: req.params.id } })
  if (!form || form.status !== 'published') {
    res.status(404).json({ error: 'Form not found or not published' })
    return
  }
  res.json(form)
}

export async function getSitemap(_req: Request, res: Response) {
  const SITE_URL = process.env.SITE_URL ?? 'https://formcraft.app'

  const forms = await prisma.form.findMany({
    where: { status: 'published' },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 1000,
  })

  const urls = forms
    .map(f => `  <url><loc>${SITE_URL}/f/${f.id}</loc><lastmod>${f.updatedAt.toISOString().split('T')[0]}</lastmod><changefreq>weekly</changefreq></url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
${urls}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.send(xml)
}
