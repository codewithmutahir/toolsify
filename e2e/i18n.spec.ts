import { test, expect } from "@playwright/test";

const locales = [
  {
    code: "en",
    dir: "ltr",
    homeTitle: /Free Online Tools/i,
    hero: "Free Online Tools for Everyone",
    contactTitle: /Contact Us/i,
  },
  {
    code: "ur",
    dir: "rtl",
    homeTitle: /مفت آن لائن ٹولز/i,
    hero: "سب کے لیے مفت آن لائن ٹولز",
    contactTitle: /رابطہ/i,
  },
  {
    code: "es",
    dir: "ltr",
    homeTitle: /Herramientas en línea gratis/i,
    hero: "Herramientas en línea gratis para todos",
    contactTitle: /Contáctanos/i,
  },
] as const;

for (const locale of locales) {
  test.describe(`locale: ${locale.code}`, () => {
    test("home page loads with correct lang, dir, and translated hero", async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      await page.goto(`/${locale.code}`);

      await expect(page).toHaveURL(new RegExp(`/${locale.code}$`));
      await expect(page).toHaveTitle(locale.homeTitle);
      await expect(page.locator("html")).toHaveAttribute("lang", locale.code);
      await expect(page.locator("html")).toHaveAttribute("dir", locale.dir);
      await expect(page.locator("h1")).toHaveText(locale.hero);
      await expect(page.locator("header")).toBeVisible();
      await expect(page.getByText("Something went wrong")).toHaveCount(0);

      expect(errors).toEqual([]);
    });

    test("contact page loads with localized title", async ({ page }) => {
      await page.goto(`/${locale.code}/contact`);
      await expect(page).toHaveURL(new RegExp(`/${locale.code}/contact`));
      await expect(page).toHaveTitle(locale.contactTitle);
      await expect(page.getByText("Something went wrong")).toHaveCount(0);
    });

    test("tool page keeps locale prefix", async ({ page }) => {
      await page.goto(`/${locale.code}/bmi-calculator`);
      await expect(page).toHaveURL(
        new RegExp(`/${locale.code}/bmi-calculator`)
      );
      await expect(page.getByText("Something went wrong")).toHaveCount(0);
    });
  });
}

test("language switcher updates cookie so unprefixed paths keep chosen locale", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await context.addCookies([
    {
      name: "NEXT_LOCALE",
      value: "ur",
      domain: "localhost",
      path: "/",
    },
  ]);

  await page.goto("/es", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/es$/);

  const switcher = page.locator("header select");
  await switcher.selectOption("en");
  await expect(page).toHaveURL(/\/en$/);

  await page.locator("a[href*='/en/tools']").first().click();
  await expect(page).toHaveURL(/\/en\/tools/);

  const cookies = await context.cookies();
  const localeCookie = cookies.find((c) => c.name === "NEXT_LOCALE");
  expect(localeCookie?.value).toBe("en");
});

test("language switcher navigates from English to Urdu", async ({ page }) => {
  await page.goto("/en", { waitUntil: "networkidle" });

  const switcher = page.locator("header select");
  await expect(switcher).toBeVisible();
  await switcher.selectOption("ur");

  await expect(page).toHaveURL(/\/ur$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ur");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});
