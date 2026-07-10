import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/modules')({
  component: ModulesLayout,
});

function ModulesLayout() {
  return <Outlet />;
}
