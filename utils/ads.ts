
import { Page } from '@playwright/test';

/**
 * Close an advertisement overlay if it appears.
 * Supports iframe close buttons and Google vignette overlays.
 */
export async function closeAdIfVisible(page: Page): Promise<void> {
  // Check for a visible close button inside any frame.
  for (const frame of page.frames()) {
    const closeButton = frame.getByRole('button', {
      name: 'Close ad'
    });

    const isVisible = await closeButton
      .isVisible()
      .catch(() => false);

    if (isVisible) {
      await closeButton.click();
      return;
    }
  }

  // Handle a Google vignette overlay when it interrupts navigation.
  if (page.url().includes('#google_vignette')) {
    await page.goBack({
      waitUntil: 'domcontentloaded'
    });
  }
}
