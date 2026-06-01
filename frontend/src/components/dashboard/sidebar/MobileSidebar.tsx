"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "./SidebarContent";

export function MobileSidebar() {

  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        flex h-16 items-center
        border-b border-border/50
        px-4
        lg:hidden
      "
    >

      <Sheet
        open={open}
        onOpenChange={setOpen}
      >

        <SheetTrigger asChild>

          <Button
            variant="ghost"
            size="icon"
          >

            <Menu className="h-5 w-5" />

          </Button>

        </SheetTrigger>

        <SheetContent
          side="left"
          className="
            w-72 p-0
          "
        >

          <SheetTitle className="sr-only">
            Dashboard navigation
          </SheetTitle>

          <SidebarContent
            onNavigate={() => {
              setOpen(false);
            }}
          />

        </SheetContent>

      </Sheet>

      <div className="ml-4">

        <h2
          className="
            text-lg font-semibold
            tracking-tight
          "
        >
          Recruitizy
        </h2>

      </div>

    </div>
  );
}
