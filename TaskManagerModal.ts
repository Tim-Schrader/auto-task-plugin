import { App, Modal, TFile, setIcon } from 'obsidian';
import { RoutineEditorModal } from 'RoutineEditorModal';

export class TaskManagerModal extends Modal {
    item: TFile;

    constructor(app: App, item: TFile) {
        super(app);
        this.item = item;
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.classList.add('task-manager-modal');
        contentEl.createEl('h1', { text: this.item.basename });

        const container = contentEl.createDiv({ cls: 'container' });

        const categories = ['One-time', 'Repeating']

        categories.forEach((category) => {
            var categoryContainer = container.createDiv({ cls: 'category-container' });
            categoryContainer.createEl('p', { text: `${category}:`, cls: 'category' });

            var button = categoryContainer.createEl('button', { cls: 'button' });
            setIcon(button, 'plus');
            button.onclick = () => {
                new RoutineEditorModal(this.app, category, categoryContainer, this.item).open()
            }
        })
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}
