import { 
  TagIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  PaintBrushIcon
} from "@heroicons/react/24/outline";

/**
 * Funcție centralizată pentru a obține iconul potrivit pentru fiecare categorie
 * @param {string} categoryName - Numele categoriei
 * @returns {React.Component} - Componenta iconului
 */
export function getCategoryIcon(categoryName) {
  const name = categoryName.toLowerCase();
  
  if (name.includes("birou")) {
    return BuildingOfficeIcon;
  }
  if (name.includes("auto")) {
    return TruckIcon;
  }
  if (name.includes("scule") || name.includes("unelte")) {
    return WrenchScrewdriverIcon;
  }
  if (name.includes("decor")) {
    return PaintBrushIcon;
  }
  
  // Icon default pentru restul categoriilor
  return TagIcon;
}

