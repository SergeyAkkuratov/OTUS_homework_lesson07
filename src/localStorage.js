export function getHistoryList() {
  const historyString = localStorage.getItem("history");
  if (historyString !== null && historyString.length > 0) {
    return historyString.split(" ");
  }
  return [];
}

export function setHistorySet(list) {
  localStorage.setItem("history", list.join(" "));
}
