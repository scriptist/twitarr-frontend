export function relativeTime(dateTime: Date, now: Date): string {
  const diffMs = dateTime.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  const suffix = diffMs < 0 ? "ago" : "in the future";

  const absDiffSecs = absDiffMs / 1000;
  const absDiffMins = absDiffSecs / 60;
  const absDiffHours = absDiffMins / 60;
  const absDiffDays = absDiffHours / 24;
  const absDiffMonths = absDiffDays / 24;

  if (absDiffSecs < 1) {
    return "Now";
  } else if (absDiffMins < 1) {
    return `${maybePluralize(Math.floor(absDiffSecs), "sec")} ${suffix}`;
  } else if (absDiffHours < 1) {
    return `${maybePluralize(Math.floor(absDiffMins), "min")} ${suffix}`;
  } else if (absDiffDays < 1) {
    return `${maybePluralize(Math.floor(absDiffHours), "hour")} ${suffix}`;
  } else if (absDiffMonths < 1) {
    return `${maybePluralize(Math.floor(absDiffDays), "day")} ${suffix}`;
  } else {
    return `${maybePluralize(Math.floor(absDiffMonths), "month")} ${suffix}`;
  }
}

function maybePluralize(
  num: number,
  singular: string,
  plural: string = `${singular}s`,
): string {
  if (num === 1) {
    return `${num} ${singular}`;
  } else {
    return `${num} ${plural}`;
  }
}
