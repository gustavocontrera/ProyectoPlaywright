import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('test', async ({ page }) => {

  // https://tiendamia.com.ar/   https://www.fravega.com/
  await page.goto('https://mercadolibre.com.ar/')
  await page.locator("input[id='cb1-edit']").fill('linterna')
  await page.keyboard.press('Enter')

  await expect(page.locator("//ol[contains(@class, 'ui-search-layout')]")).toBeVisible({ timeout: 10000 })
  //await page.pause()

  const titles = await page.locator("//ol[contains(@class, 'ui-search-layout')]//li//h3").allInnerTexts()

  console.log('the total number of result is:',  titles.length)

  for(let title of titles){
      console.log('the title is: ', title)
  }

});

//------------------------------

test("Validar título de la página Free Range Testers", async ({ page }) => {
    await test.step("Estando yo en la web principal www.freerangetesters.com", async () => {
      await page.goto('https://www.freerangetesters.com');
      await expect(page).toHaveTitle('Free Range Testers');
    });
});