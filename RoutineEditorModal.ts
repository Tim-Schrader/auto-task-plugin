import { WarningModal } from 'WarningModal';
import { Modal, TFile, App, Setting, setIcon, ToggleComponent, Vault } from 'obsidian';

export class RoutineEditorModal extends Modal {
    category: string;
    categoryContainer: HTMLElement;
    item: TFile;

    assignedDynamically: boolean;
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

        this.contentEl.classList.add('routine-editor-modal')

        switch (this.category) {
            case 'One-time':
                this.contentEl.createEl('h1', { text: 'Add One-Time task' })

                new Setting(this.contentEl)
                    .setName('Assign dynamically:')
                    .setDesc('Assign the Task automatically in a time period in which no other task occurs.')
                    .addToggle(toggle => {
                        toggle
                            .onChange(value => {
                                this.assignedDynamically = value
                                if (value) {
                                    dateSetting.settingEl.style.display = 'none'
                                    timeSetting.settingEl.style.display = 'none'
                                    prioritySetting.settingEl.style.display = 'flex'
                                    dueSetting.settingEl.style.display = 'flex'
                                } else {
                                    dateSetting.settingEl.style.display = 'flex'
                                    timeSetting.settingEl.style.display = 'flex'
                                    prioritySetting.settingEl.style.display = 'none'
                                    dueSetting.settingEl.style.display = 'none'
                                }
                            })
                    });

                var durationSetting = new Setting(this.contentEl)
                    .setName('Duration:')
                    .setDesc('The estimated amount of time the task takes to finish.')
                    .addText(input => {
                        input
                            .setPlaceholder('(hours)h (minutes)min')
                            .onChange(value => {
                                this.duration = value
                            })
                    });

                var timeSetting = new Setting(this.contentEl)
                    .setName('Time:')
                    .setDesc('The time at which the Task begins.')
                    .addText(input => {
                        input
                            .onChange(value => {
                                this.time = value
                            })
                    });
                input = timeSetting.settingEl.querySelector('input')
                input?.setAttribute('type', 'time')

                var dateSetting = new Setting(this.contentEl)
                    .setName('Date:')
                    .setDesc('The date the task is scheduled.')
                    .addText(input => {
                        input
                            .onChange(value => {
                                this.date = value
                            })
                    });
                var input = dateSetting.settingEl.querySelector('input')
                input?.setAttribute('type', 'date')

                var prioritySetting = new Setting(this.contentEl)
                    .setName('Priority:')
                    .setDesc('The priority of the task when assigned dynamically.')
                    .addDropdown(priorities => {
                        ['lowest', 'low', 'normal', 'high', 'highest', 'emergency'].forEach(priority => {
                            priorities.addOption(priority, priority)
                        })
                        priorities.onChange(value => {
                            this.priority = value
                        })
                    })
                prioritySetting.settingEl.style.display = 'none'

                var dueSetting = new Setting(this.contentEl)
                    .setName('Due:')
                    .setDesc('Date on which the task is assigned regardless of priority if it is assigned dynamically.')
                    .addText(input => {
                        input
                            .onChange(value => {
                                this.due = value
                            })
                    });
                dueSetting.settingEl.style.display = 'none'
                input = dueSetting.settingEl.querySelector('input')
                input?.setAttribute('type', 'date')

                var save = new Setting(this.contentEl)
                    .addButton((btn) =>
                        btn
                            .setButtonText('Save')
                            .setCta()
                            .onClick(async () => {
                                var buttonContainer = this.categoryContainer.createDiv({ cls: 'task-time-card' })
                                buttonContainer.createEl('button', { text: this.date, cls: 'edit-button' })
                                var deleteButton = buttonContainer.createEl('button', { cls: 'delete-button' })

                                setIcon(deleteButton, 'x');
                                deleteButton.onclick = () => {
                                    var onConfirm = () => {
                                        buttonContainer.remove()
                                    }
                                    new WarningModal(this.app, onConfirm).open()
                                }
                                this.close()
                            }));
                break;
            case 'Repeating':

                break
            default:
                break;
        }
    }
}
