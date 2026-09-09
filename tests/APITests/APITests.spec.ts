import { test, expect } from '@playwright/test';

const REPO = 'REPOLOCO';
const USER = 'gustavocontrera';

test.beforeAll(async ({ request }) => {
    const response = await request.post('user/repos', {
        data: {
            name: REPO
        }
    });
    expect(response.ok()).toBeTruthy();
})


test('Puedo crear un bug en el repo', async ({ request }) => {
    const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {
        data: {
            title: '[Bug] Explotó todo',
            body: 'Estamos perdidirijillos!',
        }
    });
    //expect(newIssue.ok()).toBeTruthy();
    expect(newIssue.status()).toBe(201);

    // expect.poll reintenta la llamada GET hasta que el bug aparezca en el listado
    await expect.poll(async () => {
        const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
        return await issues.json();
    }, {
        message: 'Esperando a que el bug aparezca en la lista de GitHub',
        timeout: 10_000,
    }).toContainEqual(expect.objectContaining({
        title: '[Bug] Explotó todo',
        body: 'Estamos perdidirijillos!'
    }));

});

test('Puedo crear un feature request', async ({ request }) => {
    const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {
        data: {
            title: '[Feature] Quiero que haga helados',
            body: 'Estaría buenísimo que el repo haga helados 🍦',
        }
    });
    //expect(newIssue.ok()).toBeTruthy();
    expect(newIssue.status()).toBe(201);

     // expect.poll reintenta el GET hasta que el issue #3 aparezca en GitHub
    await expect.poll(async () => {
        const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
        return await issues.json();
    }, {
        message: 'Esperando a que el feature request aparezca en la lista',
        timeout: 10_000,
    }).toContainEqual(expect.objectContaining({
        title: '[Feature] Quiero que haga helados',
        body: 'Estaría buenísimo que el repo haga helados 🍦'
    }));

});

test.afterAll(async ({ request }) => {
    const response = await request.delete(`/repos/${USER}/${REPO}`);
    expect(response.ok()).toBeTruthy();
});
