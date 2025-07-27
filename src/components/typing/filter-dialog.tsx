"use client";

import React, { useState } from "react";
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

const JLPT_LEVELS = ["N1", "N2", "N3", "N4", "N5"];

export default function FilterDialog() {
  const [open, setOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const clearAllFilters = () => {
    setSelectedLevels([]);
    setSelectedTags([]);
  };

  const handleSave = () => {
    console.log("Selected JLPT Levels:", selectedLevels);
    console.log("Selected Tags:", selectedTags);
    setOpen(false); // optional: close the dialog after saving
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
            {(selectedLevels.length > 0 || selectedTags.length > 0) && (
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

        {/* JLPT Level */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium">JLPT Level</h4>
          <div className="flex flex-wrap gap-2">
            {JLPT_LEVELS.map((level) => (
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

        {/* Save Button */}
        <DialogFooter className="pt-6">
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
