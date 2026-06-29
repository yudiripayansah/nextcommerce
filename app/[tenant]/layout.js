import TenantStoreShell from './TenantStoreShell'

export async function generateMetadata({ params }) {
  const { tenant } = await params
  return {
    manifest: `/api/manifest/${tenant}`,
  }
}

export default async function TenantLayout({ children, params }) {
  const { tenant } = await params
  return <TenantStoreShell slug={tenant}>{children}</TenantStoreShell>
}
