import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";


const ResponsiveModal = ({ open, onOpenChange, children }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-white rounded-t-2xl p-0 overflow-hidden">
          <div className="relative p-2">
            <DrawerClose asChild>
              <button className="absolute right-4 top-4 rounded-full bg-[#f0ede6] p-1.5 border border-black/10 cursor-pointer">
                <X className="h-3.5 w-3.5 text-[#9b9890]" />
              </button>
            </DrawerClose>
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl p-0 overflow-hidden bg-white">
        <DialogTitle />
        <div className="relative p-2">
          <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-full bg-[#f0ede6] p-1.5 border border-black/10 cursor-pointer">
              <X className="h-3.5 w-3.5 text-[#9b9890]" />
            </button>
          </DialogClose>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveModal;