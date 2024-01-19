import { App, Modal, Setting, TFile, FuzzySuggestModal, Notice, FuzzyMatch, setIcon, DropdownComponent} from "obsidian";

export class TaskSelectionModal extends FuzzySuggestModal<TFile> {
    onOpen(): void {
        super.onOpen()
        this.modalEl.classList.add("task-selection-modal")
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
    item: TFile;

    constructor(app: App, item: TFile) {
        super(app);
        this.item = item;
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.classList.add("task-manager-modal");
        contentEl.createEl("h1", { text: this.item.basename });

        const container = contentEl.createDiv({cls: "container"});

        const categories = ["One-time", "Repeating"]

        categories.forEach((category) => {
            var categoryContainer = container.createDiv({cls: "category-container"});
            categoryContainer.createEl("p", {text: `${category}:`, cls: "category"});
    
            var button = categoryContainer.createEl("button", {cls: "button"});
            setIcon(button, "plus");
            button.onclick = () => {
                new RoutineEditor(this.app, category, categoryContainer, this.item).open()
            }
        })
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}

export class RoutineEditor extends Modal {
    category: string;
    categoryContainer: HTMLElement;
    item: TFile;

    date: string;
    time: string;
    priority: string;
    due: string;
    duration: string;

    constructor(app: App, category: string, categoryContainer: HTMLElement, item: TFile) {
        super(app);
        this.category = category;
        this.categoryContainer = categoryContainer;
        this.item = item;
    }

    onOpen(): void {

        this.contentEl.classList.add("routine-editor-modal")

        switch (this.category) {
            case "One-time":
                this.contentEl.createEl("h1", {text: "Add One-Time task"})

                var setting = new Setting(this.contentEl)
                    .setName("Date:")
                    .setDesc("The date the task is scheduled. Leave empty to assign dynamically.")
                    .addText(input => {
                        input
                            .onChange(value => {
                                this.date = value
                            })
                    });
                var input = setting.settingEl.querySelector("input")
                input?.setAttribute("type", "date")

                setting = new Setting(this.contentEl)
                    .setName("Time:")
                    .setDesc("The date the task is scheduled. Leave empty to assign dynamically.")
                    .addText(input => {
                        input
                            .onChange(value => {
                                this.time = value
                            })
                    });
                input = setting.settingEl.querySelector("input")
                input?.setAttribute("type", "time")
                
                new Setting(this.contentEl)
                    .setName("Priority:")
                    .setDesc("The priority of the task when assigned dynamically.")
                    .addDropdown(priorities => {
                        ["lowest", "low", "normal", "high", "highest", "emergency"].forEach(priority => {
                            priorities.addOption(priority, priority)
                        })
                        priorities.onChange(value => {
                            this.priority = value
                        })
                    })

                setting = new Setting(this.contentEl)
                .setName("Due:")
                .setDesc("Date on which the task is assigned regardless of priority if it is assigned dynamically.")
                .addText(input => {
                    input
                        .onChange(value => {
                            this.due = value
                        })
                });
                input = setting.settingEl.querySelector("input")
                input?.setAttribute("type", "date")

                new Setting(this.contentEl)
                .setName("Duration:")
                .setDesc("The estimated amount of time the task takes to finish.")
                .addText(input => {
                    input
                        .setPlaceholder("(hours)h (minutes)min")
                        .onChange(value => {
                            this.duration = value
                        })
                });

                new Setting(this.contentEl)
                    .addButton((btn) =>
                        btn
                        .setButtonText("Save")
                        .setCta()
                        .onClick(() => {
                            var buttonContainer = this.categoryContainer.createDiv({cls: "task-time-card"})
                            buttonContainer.createEl("button", {text: this.date, cls: "edit-button"})
                            var deleteButton = buttonContainer.createEl("button", {cls: "delete-button"})
                            setIcon(deleteButton, "x");
                            this.close()
                        }));

                break;
            case "Repeating":
                
                break
            default:
                break;
        }
    }
}
