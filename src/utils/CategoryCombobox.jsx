import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function CategoryCombobox({ onChange }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([
        { value: "mathematics", label: "Mathematics" },
        { value: "biology", label: "Biology" },
        { value: "physics", label: "Physics" },
        { value: "chemistry", label: "Chemistry" },
        { value: "english", label: "English" },
        { value: "hindi", label: "Hindi" },
    ]);

    const filtered = useMemo(() => {
        return categories.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [categories, search]);

    const handleCreate = () => {
        if (!search.trim()) return;
        const newCategory = { value: search.toLowerCase(), label: search };
        setCategories([...categories, newCategory]);
        setValue(newCategory.value);
        setOpen(false);
        if (onChange) onChange(newCategory.value);
    };

    const handleSelect = (currentValue) => {
        const newValue = currentValue === value ? "" : currentValue;
        setValue(newValue);
        setOpen(false);
        if (onChange) onChange(newValue);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[240px] justify-between"
                >
                    {value
                        ? categories.find((cat) => cat.value === value)?.label
                        : "Select or create category..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[240px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search or create category..."
                        className="h-9"
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {filtered.length > 0 ? (
                            <CommandGroup>
                                {filtered.map((cat) => (
                                    <CommandItem
                                        key={cat.value}
                                        value={cat.value}
                                        onSelect={handleSelect}
                                    >
                                        {cat.label}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === cat.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : (
                            <CommandEmpty>
                                <Button
                                    variant="ghost"
                                    className="w-full flex items-center justify-start gap-2"
                                    onClick={handleCreate}
                                >
                                    <PlusCircle size={16} />
                                    Create “{search}”
                                </Button>
                            </CommandEmpty>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
