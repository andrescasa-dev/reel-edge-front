"use client";

import Link from "next/link";
import { Button } from "@/core/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-foreground">Made with passion by andres 🚀</p>
      <Link href="/dashboard">
        <Button size="lg">Go to Dashboard</Button>
      </Link>
    </main>
  );
}
