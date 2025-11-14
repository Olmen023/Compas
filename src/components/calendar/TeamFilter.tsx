"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface Team {
  id: string;
  name: string;
  type: "couple" | "team";
}

interface TeamFilterProps {
  teams: Team[];
  selectedTeams: string[];
  onTeamsChange: (teams: string[]) => void;
}

export function TeamFilter({
  teams,
  selectedTeams,
  onTeamsChange,
}: TeamFilterProps) {
  const [showFilter, setShowFilter] = useState(false);

  const handleTeamToggle = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      onTeamsChange(selectedTeams.filter((id) => id !== teamId));
    } else {
      onTeamsChange([...selectedTeams, teamId]);
    }
  };

  const clearFilters = () => {
    onTeamsChange([]);
  };

  if (teams.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => setShowFilter(!showFilter)}
        className={selectedTeams.length > 0 ? "bg-primary/10" : ""}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtrar por Equipo
        {selectedTeams.length > 0 && (
          <span className="ml-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs">
            {selectedTeams.length}
          </span>
        )}
      </Button>

      {showFilter && (
        <div className="flex flex-wrap items-center gap-2">
          {teams.map((team) => (
            <Button
              key={team.id}
              variant={selectedTeams.includes(team.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTeamToggle(team.id)}
            >
              {team.name}
              {selectedTeams.includes(team.id) && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Button>
          ))}

          {selectedTeams.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
