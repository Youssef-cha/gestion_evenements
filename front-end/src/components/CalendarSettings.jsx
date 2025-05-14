"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

export function CalendarSettings({ settings, setSettings }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Calendar</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={settings.showWeekendDays}
          onCheckedChange={(value) => {
            setSettings({ ...settings, showWeekendDays: value });
          }}
        >
          show week-end days
        </DropdownMenuCheckboxItem>

        <DropdownMenuLabel>Events</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={settings.showPassedEvents}
          onCheckedChange={(value) => {
            setSettings({ ...settings, showPassedEvents: value });
          }}
        >
          show passed events
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={settings.showFutureEvents}
          onCheckedChange={(value) => {
            setSettings({ ...settings, showFutureEvents: value });
          }}
        >
          show future events
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={settings.showInvitedEvents}
          onCheckedChange={(value) => {
            setSettings({ ...settings, showInvitedEvents: value });
          }}
        >
          show invited events
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default CalendarSettings;
