import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Returns the number of full years elapsed since `startDate`. */
export function getYearsOfExperience(startDate: Date): number {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  const hasHadBirthday =
    now.getMonth() > startDate.getMonth() ||
    (now.getMonth() === startDate.getMonth() && now.getDate() >= startDate.getDate());
  if (!hasHadBirthday) years -= 1;
  return years;
}

/** Career start — March 2017 */
const CAREER_START = new Date(2017, 2, 1); // month is 0-indexed

/** Returns a formatted string like "9+ years" */
export function getExperienceLabel(): string {
  return `${getYearsOfExperience(CAREER_START)}+ years`;
}

/** Returns the numeric years value for the career start date. */
export function getCareerYears(): number {
  return getYearsOfExperience(CAREER_START);
}
