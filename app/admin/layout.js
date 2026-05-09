import AdminShell from '@/components/AdminShell';

export const metadata = {
  title: 'Admin — Creatify AI',
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
