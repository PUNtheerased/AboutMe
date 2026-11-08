import type { Metadata } from "next";
import { PortfolioList } from "@/components/portfolio/portfolio-list";
import { portfolio } from "@/lib/data/portfolio";

export const metadata: Metadata = {
  description: "Things Pun has shipped, tinkered with, or still iterates on.",
};

export default function PortfolioPage() {
  return <PortfolioList items={portfolio} />;
}
