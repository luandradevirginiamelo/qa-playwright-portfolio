import { Page } from '@playwright/test';

export async function acceptConsentIfVisible(page: Page) {
  const consentDialog = page.getByRole('dialog', {
    name: 'This site asks for consent to use your data'
  });

  const consentButton = consentDialog.getByRole('button', {
    name: 'Consent',
    exact: true
  });

  const dialogAppeared = await consentDialog
    .waitFor({
      state: 'visible',
      timeout: 5000
    })
    .then(() => true)
    .catch(() => false);

  if (dialogAppeared) {
    await consentButton.click();

    // Make sure the overlay is actually gone before continuing.
    await consentDialog.waitFor({
      state: 'hidden',
      timeout: 5000
    });
  }
}