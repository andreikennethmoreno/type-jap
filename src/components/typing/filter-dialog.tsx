"use client";

import React, { useEffect, useState, startTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

import {
  loadJLPTLevels,
  updateJLPTConfig,
  resetJLPTConfig,
} from "@/actions/jlpt-config.actions";

const DEFAULT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];

export default function FilterDialog() {
  const [open, setOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      startTransition(async () => {
        const levels = await loadJLPTLevels();
        setSelectedLevels(levels);
      });
    }
  }, [open]);

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const clearAllFilters = () => {
    setSelectedLevels([]);
  };

  const handleSave = () => {
    startTransition(() => {
      updateJLPTConfig(selectedLevels);
    });
    setOpen(false);
  };

  const handleReset = () => {
    startTransition(async () => {
      await resetJLPTConfig();
      setSelectedLevels(DEFAULT_LEVELS);
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 px-3">
          <Filter className="w-5 h-5" />
          <span className="hidden md:inline">Filter</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[480px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
            {selectedLevels.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* JLPT Level Section */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium">JLPT Level</h4>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_LEVELS.map((level) => (
              <Button
                key={level}
                variant={selectedLevels.includes(level) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleLevel(level)}
                className="min-w-[60px]"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        <DialogFooter className="pt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
