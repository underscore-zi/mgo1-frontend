
export function duration(delta) {
  delta = Math.abs(delta);
  const seconds = Math.floor(delta / 1000) % 60;
  const minutes = Math.floor(delta / (1000 * 60)) % 60;
  const hours = Math.floor(delta / (1000 * 60 * 60));

  // Format the delta as HH:MM:SS
  const formattedDelta = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return formattedDelta;
}
  
export function timeSince(date) {
  const now = new Date();
  const delta = Math.abs(now - date);

  const seconds = Math.floor(delta / 1000);
  const minutes = Math.floor(delta / (1000 * 60));
  const hours = Math.floor(delta / (1000 * 60 * 60));
  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const months = Math.floor(delta / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(delta / (1000 * 60 * 60 * 24 * 365));
  const monthsInYear = Math.floor((delta % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));

  if (seconds < 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  } else if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (days < 30) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (months < 12) {
      return `${months} month${months === 1 ? '' : 's'} ago`;
  } else if (years < 2) {
      return `${years} year, ${monthsInYear} month${monthsInYear === 1 ? '' : 's'} ago`;
  } else {
      return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}


export const periods = ["all-time", "weekly", "archive"]
export const modes =      ["deathmatch", "team deathmatch", "rescue", "capture", "sneaking"]
export const modesShort = ["dm",         "tdm",             "res",    "cap",     "sne"]
export const maps = ["lost forest","ghost factory","city under siege","killhouse a","killhouse b","killhouse c","svyatogornyj east","mountaintop","graniny gorki lab","pillbox purgatory","high ice","brown town"]