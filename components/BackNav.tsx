"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackNav() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="fixed top-4 left-4 z-50 gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
      onClick={() => router.back()}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </Button>
  );
}
