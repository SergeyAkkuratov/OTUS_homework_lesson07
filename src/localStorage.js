function setToString(set) {
  let str = "";
  set.forEach((value) => {
    str += `${value} `;
  });
  return str.trim();
}

function stringToSet(string) {
  const set = new Set();
  string.split(" ").forEach((value) => {
    set.add(value);
  });
  return set;
}

export function getHistorySet() {
  let historySet = new Set();
  const historyString = localStorage.getItem("history");
  if (historyString !== null && historyString.length > 0) {
    historySet = stringToSet(historyString);
  }
  return historySet;
}

export function setHistorySet(historySet) {
  localStorage.setItem("history", setToString(historySet));
}
