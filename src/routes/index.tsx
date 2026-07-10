import { createFileRoute } from "@tanstack/react-router";
import { CareerPortal } from "@/components/career-portal/CareerPortal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CyberOS Enterprise · Build Your Career at GFS" },
      {
        name: "description",
        content:
          "Enterprise Cybersecurity Career Framework at Global Financial Services — explore 40+ roles, 20 departments and every path from Associate to CISO.",
      },
    ],
  }),
  component: CareerPortal,
});