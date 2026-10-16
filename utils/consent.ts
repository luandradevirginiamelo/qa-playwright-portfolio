
import { Page } from '@playwright/test';

export async function acceptConsentIfVisible(page: Page): Promise<void> {
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

    await consentDialog.waitFor({
      state: 'hidden',
      timeout: 10000
    });
  }

  // Ensure the consent overlay is no longer blocking interactions.
  const consentOverlay = page.locator('.fc-dialog-overlay');

  if (await consentOverlay.isVisible()) {
    await consentOverlay.waitFor({
      state: 'hidden',
      timeout: 10000
    });
  }
}
