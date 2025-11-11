// Initialize MSW on server before making API calls
import "@/core/mocks/init-server";

import { MissingCasinosContent } from "@/modules/missing-casinos";

// Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

export default function MissingCasinosPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <MissingCasinosContent />
    </div>
  );
}

