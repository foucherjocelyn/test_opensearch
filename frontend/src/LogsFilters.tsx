import React from "react";
import type { FiltersModel } from "./Models/FilterModel";

interface LogsFiltersProps {
  filters: FiltersModel;
  setFilters: React.Dispatch<React.SetStateAction<FiltersModel>>;
}

export default function LogsFilters({ filters, setFilters }: LogsFiltersProps) {
    return (
        <div className="mb-4 flex justify-center gap-3">
            <input
                type="text"
                placeholder="Search by message..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
            />
            <select
                value={filters.level}
                onChange={e => setFilters({ ...filters, level: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 w-max max-w-3xs"
            >
                <option value="">Filter by level...</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
                <option value="DEBUG">DEBUG</option>
            </select>
            <input
                type="text"
                placeholder="Filter by service..."
                value={filters.service}
                onChange={e => setFilters({ ...filters, service: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 w-full max-w-2xs"
            />
        </div>
    )
}