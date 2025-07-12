import type { LogFilters } from "../types";

interface LogsFiltersProps {
  filters: LogFilters;
  setFilters: (filters: LogFilters) => void;
}

export default function LogsFilters({ filters, setFilters }: LogsFiltersProps) {
    const minDate = "2010-01-01";
    const maxDate = "2030-12-31";

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
            <input
                aria-label="Date from"
                type="date"
                min={minDate}
                max={maxDate}
                value={filters.startDate || ""}
                onChange={e => setFilters({ ...filters, startDate: e.target.value })}
            />
            <input
                aria-label="Date to"
                type="date"
                min={minDate}
                max={maxDate}
                value={filters.endDate || ""}
                onChange={e => setFilters({ ...filters, endDate: e.target.value })}
            />
        </div>
    )
}