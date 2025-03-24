export const formatDate = (dateString:any) => {
  const date = new Date(dateString);
  const day = date.getDate();

  const ordinalSuffix = (day:any) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const month = date.toLocaleString("default", { month: "short" });
  return `${day}${ordinalSuffix(day)} ${month}`;
};