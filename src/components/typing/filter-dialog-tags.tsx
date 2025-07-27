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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, ChevronDown, ChevronUp, Filter } from "lucide-react";

const JLPT_LEVELS = ["N1", "N2", "N3", "N4", "N5"];
const TAGS = [
  "food",
  "animal",
  "verb",
  "adjective",
  "noun",
  "adverb",
  "particle",
  "family",
  "colors",
  "numbers",
  "time",
  "weather",
  "travel",
  "business",
  "emotions",
  "body",
  "clothing",
  "transportation",
  "education",
  "technology",
];

export default function FilterDialogTags() {
  const [open, setOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const removeLevel = (level: string) => {
    setSelectedLevels((prev) => prev.filter((l) => l !== level));
  };

  const clearAllFilters = () => {
    setSelectedLevels([]);
    setSelectedTags([]);
    setTagSearch("");
  };

  const filteredTags = TAGS.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );
  const displayedTags = showAllTags ? filteredTags : filteredTags.slice(0, 12);

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

        {/* Selected Levels */}
        {selectedLevels.length > 0 && (
          <div className="space-y-2 pt-4">
            <h4 className="text-sm font-medium">
              Selected Levels ({selectedLevels.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedLevels.map((level) => (
                <Badge
                  key={level}
                  variant="secondary"
                  className="px-3 py-1 text-xs"
                >
                  {level}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => removeLevel(level)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="space-y-2 pt-4">
            <h4 className="text-sm font-medium">
              Selected Tags ({selectedTags.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 text-xs"
                >
                  {tag}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tag Search */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Tags</h4>
            <span className="text-xs text-gray-500">
              {selectedTags.length} selected
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Tag Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {displayedTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className="h-8 text-xs justify-start hover:scale-[1.03]"
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Show More */}
          {filteredTags.length > 12 && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-blue-600"
              >
                {showAllTags ? (
                  <>
                    Show Less <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show More ({filteredTags.length - 12} more)
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* No results */}
          {filteredTags.length === 0 && tagSearch && (
            <div className="text-center py-4 text-sm">
              No tags found for "{tagSearch}"
            </div>
          )}
        </div>

        {/* Active Summary */}
        {(selectedLevels.length > 0 || selectedTags.length > 0) && (
          <DialogFooter className="pt-4">
            <div className="text-sm">
              <span className="font-medium">Active filters:</span>{" "}
              {selectedLevels.join(", ")}
              {selectedLevels.length > 0 && selectedTags.length > 0 && ", "}
              {selectedTags.length > 0 &&
                `${selectedTags.length} tag${
                  selectedTags.length !== 1 ? "s" : ""
                }`}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
