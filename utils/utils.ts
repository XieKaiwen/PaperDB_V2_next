import { type ClassValue, clsx } from 'clsx';
import { NextRequest } from 'next/server';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function getBaseUrl(request: NextRequest): string {
  // Check if we have a base URL defined in the environment
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (envBaseUrl) {
    return envBaseUrl;
  }

  // Fallback to constructing from the request
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export function generateYearList() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= 2000; i--) {
    years.push({ value: `${i}`, label: `${i}` });
  }
  return years;
}

export function generateOptionsFromJsonList<
  T extends Record<string, unknown>,
  VKey extends keyof T,
  LKey extends keyof T,
>(
  JSONList: T[],
  valueKey: VKey & (T[VKey] extends string ? VKey : never),
  labelKey: LKey & (T[LKey] extends string ? LKey : never),
): { value: string; label: string }[] {
  return JSONList.map((item) => ({
    value: item[valueKey] as string,
    label: item[labelKey] as string,
  }));
}

export function convertRomanToInt(romanNumeral: string): number {
  const romanToIntMap: { [key: string]: number } = {
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
    v: 5,
    vi: 6,
    vii: 7,
    viii: 8,
    ix: 9,
    x: 10,
  };

  return romanToIntMap[romanNumeral];
}

export function removeImagesFromHtml(htmlString: string) {
  // Create a temporary DOM element to parse the HTML string
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString;

  // Select all <img> elements and remove them
  const images = tempElement.querySelectorAll('img');
  images.forEach((img) => img.remove());

  // Return the modified HTML as a string
  return tempElement.innerHTML;
}

export function setSearchParams({
  searchParams,
  paramsToSet,
}: {
  searchParams: URLSearchParams;
  paramsToSet: Record<string, unknown>;
}) {
  // console.log("Params to set: ", paramsToSet);

  for (const [key, value] of Object.entries(paramsToSet)) {
    if (typeof value === 'string') {
      searchParams.set(key, value);
      continue;
    } else if (typeof value === 'boolean') {
      const treatedValue = value ? 'true' : 'false';
      searchParams.set(key, treatedValue);
      continue;
    }
    const treatedValue = JSON.stringify(value);
    searchParams.set(key, treatedValue);
  }
  return searchParams;
}
