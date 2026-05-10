import StudioShell from '@/components/StudioShell'

export const metadata = {
  title: 'Creatify AI — Free AI Image & Video Studio',
  description: 'Generate AI images and videos using 200+ models — Flux, Midjourney, Kling, Veo, Seedance and more. Free open-source alternative to Higgsfield AI.',
}

export default function StudioLayout({ children }) {
  return <StudioShell>{children}</StudioShell>
}
