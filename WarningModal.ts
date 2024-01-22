import { App, Modal, Setting } from "obsidian";

export class WarningModal extends Modal {
    onConfirm: () => void;

    constructor(app: App, onConfirm: () => void) {
        super(app);
        this.onConfirm = onConfirm
    }

    onOpen() {
        const { contentEl } = this;

        this.titleEl.textContent = "Delete Task"

        this.contentEl.createEl("p", {text: "Are your sure you wan't to delete that Task?", cls: "mod-warning"})

        var buttonContainer = this.modalEl.createDiv({cls: "modal-button-container"})

        var confirm = buttonContainer.createEl("button", {text: "Confirm", cls: "mod-warning"})
        confirm.onclick = () => {
            this.onConfirm()
            this.close()
        }

        var cancel = buttonContainer.createEl("button", {text: "Cancel"})
        cancel.onclick = () => {
            this.close()
        }
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}