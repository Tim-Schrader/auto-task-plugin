import { FuzzySuggestModal, TFile } from 'obsidian';
import { TaskManagerModal } from 'TaskManagerModal';

export class TaskSelectionModal extends FuzzySuggestModal<TFile> {
    onOpen(): void {
        super.onOpen()
        this.modalEl.classList.add('task-selection-modal')
        this.modalEl.createEl('h1', { text: 'Taskmanager' });
        this.modalEl.createEl('h2', { text: 'Select task:' });
    }
    getItems(): TFile[] {
        const files = this.app.vault.getMarkdownFiles().filter(el => {
            if (el.parent?.name == 'Tasks') {
                return el
            }
        })
        return files
    }
    getItemText(item: TFile): string {
        return item.basename
    }
    onChooseItem(item: TFile, evt: MouseEvent | KeyboardEvent): void {
        new TaskManagerModal(this.app, item).open()
    }
}