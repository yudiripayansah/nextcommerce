import TenantStoreShell from './TenantStoreShell'

export default async function TenantLayout({ children, params }) {
  const { tenant } = await params
  return <TenantStoreShell slug={tenant}>{children}</TenantStoreShell>
}
