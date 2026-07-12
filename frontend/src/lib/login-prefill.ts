export type LoginPrefill = {
  identifier: string;
  password: string;
};

export function getLoginPrefill(searchParams: URLSearchParams | null): LoginPrefill | null {
  if (searchParams?.get("demo") === "1") {
    return {
      identifier: "demo",
      password: "demo",
    };
  }

  return null;
}
