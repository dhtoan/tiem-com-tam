// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { SaveConflictDialog } from '../../src/client/ui/account/SaveConflictDialog';

describe('SaveConflictDialog UI', () => {
  it('renders conflict details and handles choices', () => {
    const onChoice = vi.fn();
    const dialog = new SaveConflictDialog({
      localMeta: { day: 3, money: 150000, reputation: 60, updatedAt: 1000 },
      cloudMeta: { day: 5, money: 300000, reputation: 75, revision: 3, updatedAt: 2000 },
      localSaveJson: JSON.stringify({ day: 3 }),
      cloudSaveJson: JSON.stringify({ day: 5 }),
      onChoice
    });

    const el = dialog.getElement();
    document.body.appendChild(el);

    expect(el.querySelector('[data-testid="local-save-card"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="cloud-save-card"]')).not.toBeNull();
    expect(el.textContent).toContain('Xung đột bản lưu đám mây');

    const inspectBtn = el.querySelector('[data-action="inspect"]') as HTMLButtonElement;
    const inspectPanel = el.querySelector('[data-testid="conflict-inspect-panel"]') as HTMLElement;
    expect(inspectPanel.style.display).toBe('none');

    inspectBtn.click();
    expect(inspectPanel.style.display).toBe('block');
    expect(onChoice).toHaveBeenCalledWith('inspect');

    const useCloudBtn = el.querySelector('[data-action="use-cloud"]') as HTMLButtonElement;
    useCloudBtn.click();
    expect(onChoice).toHaveBeenCalledWith('use_cloud');

    const keepDeviceBtn = el.querySelector('[data-action="keep-device"]') as HTMLButtonElement;
    keepDeviceBtn.click();
    expect(onChoice).toHaveBeenCalledWith('keep_device');

    document.body.removeChild(el);
  });
});
