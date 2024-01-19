import { App, Modal, Setting, TFile, FuzzySuggestModal, Notice, FuzzyMatch, setIcon} from "obsidian";

export class TaskSelectionModal extends FuzzySuggestModal<TFile> {
    onOpen(): void {
        super.onOpen()
        this.modalEl.classList.add("task__selection__modal")
        this.modalEl.createEl("h1", { text: "Taskmanager"});
        this.modalEl.createEl("h2", { text: "Select task:"});
    }
    getItems(): TFile[] {
        const files = this.app.vault.getMarkdownFiles().filter(el => {
            if (el.parent?.name == "Tasks") {
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

export class TaskManagerModal extends Modal {
    result: string;
    item: TFile;

    constructor(app: App, item: TFile) {
        super(app);
        this.item = item;
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.classList.add("task__manager__modal")
        contentEl.createEl("h1", { text: this.item.basename });

        const container = contentEl.createDiv({cls: "container"})

        const dailyContainer = container.createDiv({cls: "category__container"})
        dailyContainer.createEl("p", {text: "Daily:", cls: "category"})

        const dailyIcon = dailyContainer.createEl("button", {cls: "button"})
        setIcon(dailyIcon, "plus")
        

        const weeklyContainer = container.createDiv({cls: "category__container"})
        weeklyContainer.createEl("p", {text: "Weekly:", cls: "category"})

        const weeklyIcon = weeklyContainer.createEl("button", {cls: "button"})
        setIcon(weeklyIcon, "plus")


    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}
