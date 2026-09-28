export type ConflictChoice = 'use_cloud' | 'keep_device' | 'inspect';

export interface SaveMetadata {
  day?: number;
  money?: number;
  reputation?: number;
  updatedAt?: number | null;
  revision?: number;
}

export interface SaveConflictDialogOptions {
  localMeta: SaveMetadata;
  cloudMeta: SaveMetadata;
  localSaveJson?: string;
  cloudSaveJson?: string;
  onChoice: (choice: ConflictChoice) => void;
}

export class SaveConflictDialog {
  private element: HTMLElement;
  private options: SaveConflictDialogOptions;
  private inspectPanel: HTMLElement | null = null;

  constructor(options: SaveConflictDialogOptions) {
    this.options = options;
    this.element = this.render();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private render(): HTMLElement {
    const root = document.createElement('div');
    root.className = 'save-conflict-dialog';
    root.setAttribute('data-testid', 'save-conflict-dialog');

    const title = document.createElement('h2');
    title.className = 'dialog-title';
    title.textContent = 'Xung đột bản lưu đám mây';
    root.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'dialog-description';
    desc.textContent =
      'Bản lưu trên máy chủ đã được cập nhật từ thiết bị khác. Vui lòng chọn phiên bản bạn muốn tiếp tục sử dụng:';
    root.appendChild(desc);

    const comparisonGrid = document.createElement('div');
    comparisonGrid.className = 'conflict-comparison-grid';

    // Local card
    const localCard = document.createElement('div');
    localCard.className = 'save-card local-save-card';
    localCard.setAttribute('data-testid', 'local-save-card');
    localCard.innerHTML = `
      <h3>Thiết bị này</h3>
      <p><strong>Ngày:</strong> ${this.options.localMeta.day ?? '—'}</p>
      <p><strong>Tiền mặt:</strong> ${(this.options.localMeta.money ?? 0).toLocaleString('vi-VN')} đ</p>
      <p><strong>Uy tín:</strong> ${this.options.localMeta.reputation ?? '—'}</p>
      <p><strong>Cập nhật:</strong> ${this.options.localMeta.updatedAt ? new Date(this.options.localMeta.updatedAt).toLocaleString('vi-VN') : 'Mới đây'}</p>
    `;
    comparisonGrid.appendChild(localCard);

    // Cloud card
    const cloudCard = document.createElement('div');
    cloudCard.className = 'save-card cloud-save-card';
    cloudCard.setAttribute('data-testid', 'cloud-save-card');
    cloudCard.innerHTML = `
      <h3>Máy chủ đám mây</h3>
      <p><strong>Bản sửa đổi:</strong> #${this.options.cloudMeta.revision ?? 1}</p>
      <p><strong>Ngày:</strong> ${this.options.cloudMeta.day ?? '—'}</p>
      <p><strong>Tiền mặt:</strong> ${(this.options.cloudMeta.money ?? 0).toLocaleString('vi-VN')} đ</p>
      <p><strong>Uy tín:</strong> ${this.options.cloudMeta.reputation ?? '—'}</p>
      <p><strong>Cập nhật:</strong> ${this.options.cloudMeta.updatedAt ? new Date(this.options.cloudMeta.updatedAt).toLocaleString('vi-VN') : 'Không rõ'}</p>
    `;
    comparisonGrid.appendChild(cloudCard);
    root.appendChild(comparisonGrid);

    // Inspect preview panel
    this.inspectPanel = document.createElement('div');
    this.inspectPanel.className = 'conflict-inspect-panel';
    this.inspectPanel.style.display = 'none';
    this.inspectPanel.setAttribute('data-testid', 'conflict-inspect-panel');
    this.inspectPanel.innerHTML = `
      <h4>Chi tiết dữ liệu</h4>
      <div class="inspect-diff">
        <div><strong>Bản lưu máy này:</strong><pre>${this.options.localSaveJson ? JSON.stringify(JSON.parse(this.options.localSaveJson), null, 2) : 'Không có'}</pre></div>
        <div><strong>Bản lưu đám mây:</strong><pre>${this.options.cloudSaveJson ? JSON.stringify(JSON.parse(this.options.cloudSaveJson), null, 2) : 'Không có'}</pre></div>
      </div>
    `;
    root.appendChild(this.inspectPanel);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'conflict-actions';

    const useCloudBtn = document.createElement('button');
    useCloudBtn.className = 'btn btn-primary';
    useCloudBtn.setAttribute('data-action', 'use-cloud');
    useCloudBtn.textContent = 'Dùng bản lưu Cloud';
    useCloudBtn.addEventListener('click', () => {
      this.options.onChoice('use_cloud');
    });

    const keepDeviceBtn = document.createElement('button');
    keepDeviceBtn.className = 'btn btn-secondary';
    keepDeviceBtn.setAttribute('data-action', 'keep-device');
    keepDeviceBtn.textContent = 'Giữ bản lưu thiết bị này';
    keepDeviceBtn.addEventListener('click', () => {
      this.options.onChoice('keep_device');
    });

    const inspectBtn = document.createElement('button');
    inspectBtn.className = 'btn btn-outline';
    inspectBtn.setAttribute('data-action', 'inspect');
    inspectBtn.textContent = 'Xem chi tiết';
    inspectBtn.addEventListener('click', () => {
      this.toggleInspect();
      this.options.onChoice('inspect');
    });

    actions.appendChild(useCloudBtn);
    actions.appendChild(keepDeviceBtn);
    actions.appendChild(inspectBtn);
    root.appendChild(actions);

    return root;
  }

  public toggleInspect(): void {
    if (this.inspectPanel) {
      this.inspectPanel.style.display = this.inspectPanel.style.display === 'none' ? 'block' : 'none';
    }
  }
}
