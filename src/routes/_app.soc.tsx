import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/soc')({
  component: SocLayout,
});

function SocLayout() {
  return <Outlet />;
}
