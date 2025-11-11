"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";

interface ResearchModalProps {
  open: boolean;
  onStop: () => void;
  isStopping?: boolean;
}

export function ResearchModal({
  open,
  onStop,
  isStopping = false,
}: ResearchModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Researching...
          </DialogTitle>
          <DialogDescription>
            The research process is currently running. This may take a few
            minutes. You can stop the research at any time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onStop}
            disabled={isStopping}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            {isStopping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Stopping...
              </>
            ) : (
              "Stop Research"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

