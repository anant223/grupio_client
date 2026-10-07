export const categoryColor = {
  music: "#D85A30",
  sports: "#1D9E75",
  tech: "#378ADD",
  business: "#BA7517",
  arts: "#D4537E",
  food: "#639922",
  networking: "#7F77DD",
  fitness: "#0F6E56",
  health: "#185FA5",
  education: "#534AB7",
  entertainment: "#993C1D",
  other: "#888780",
};

export const categoryBg = {
  music: "#FAECE7",
  sports: "#E1F5EE",
  tech: "#E6F1FB",
  business: "#FAEEDA",
  arts: "#FBEAF0",
  food: "#EAF3DE",
  networking: "#EEEDFE",
  fitness: "#E1F5EE",
  health: "#E6F1FB",
  education: "#EEEDFE",
  entertainment: "#FAECE7",
  other: "#F1EFE8",
};

export const fmtMonthYear = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

export const fmtShort = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
