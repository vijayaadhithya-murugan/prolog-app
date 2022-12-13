import React, { useState, useContext } from "react";
import { useWindowSize } from "react-use";
import { useDebouncedCallback } from "use-debounce";
import { capitalize } from "lodash";
import { Select, Option, Input, NavigationContext } from "@features/ui";
import { IssueFilters, IssueLevel, IssueStatus } from "@api/issues.types";
import { useFilters } from "../../hooks/use-filters";
import * as S from "./filters.styled";

function getStatusDefaultValue(filters: IssueFilters) {
  if (!filters.status) {
    return "Status";
  }
  if (filters.status === IssueStatus.open) {
    return "Unresolved";
  }
  return "Resolved";
}

function getLevelDefaultValue(filters: IssueFilters) {
  if (!filters.level) {
    return "Level";
  }
  return capitalize(filters.level);
}

export function Filters() {
  const { handleFilters, filters } = useFilters();

  const debouncedHandleFilters = useDebouncedCallback(handleFilters, 300);
  const [inputValue, setInputValue] = useState(filters.project || "");

  const { width } = useWindowSize();
  const isMobileScreen = width <= 1023;
  const { isMobileMenuOpen } = useContext(NavigationContext);

  const handleChange = (project: string) => {
    setInputValue(project);
    debouncedHandleFilters({ project: project.toLowerCase() });
  };

  const handleLevel = (level?: string) => {
    if (level) {
      level = level.toLowerCase();
    }
    handleFilters({ level: level as IssueLevel });
  };

  const handleStatus = (status?: string) => {
    if (status === "Unresolved") {
      status = "open";
    }
    if (status) {
      status = status.toLowerCase();
    }
    handleFilters({ status: status as IssueStatus });
  };

  return (
    <S.Container>
      <Select
        placeholder="Status"
        defaultValue={getStatusDefaultValue(filters)}
        width={isMobileScreen ? "97%" : "8rem"}
        style={{
          ...(isMobileMenuOpen && {
            opacity: 0,
          }),
        }}
      >
        <Option value={undefined} handleCallback={handleStatus}>
          --None--
        </Option>
        <Option value="Unresolved" handleCallback={handleStatus}>
          Unresolved
        </Option>
        <Option value="Resolved" handleCallback={handleStatus}>
          Resolved
        </Option>
      </Select>

      <Select
        placeholder="Level"
        defaultValue={getLevelDefaultValue(filters)}
        width={isMobileScreen ? "97%" : "8rem"}
        style={{
          ...(isMobileMenuOpen && {
            opacity: 0,
          }),
        }}
      >
        <Option value={undefined} handleCallback={handleLevel}>
          --None--
        </Option>
        <Option value="Error" handleCallback={handleLevel}>
          Error
        </Option>
        <Option value="Warning" handleCallback={handleLevel}>
          Warning
        </Option>
        <Option value="Info" handleCallback={handleLevel}>
          Info
        </Option>
      </Select>

      <Input
        handleChange={handleChange}
        value={inputValue}
        label="project name"
        placeholder="Project Name"
        iconSrc="/icons/search-icon.svg"
        style={{
          ...(isMobileScreen && { width: "94%", marginRight: "3rem" }),
          ...(isMobileMenuOpen && {
            opacity: 0,
          }),
        }}
      />
    </S.Container>
  );
}