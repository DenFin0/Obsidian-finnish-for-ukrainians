import { App, Modal, Notice, Plugin } from 'obsidian';

class WordModal extends Modal {

	onSubmit: (result: string) => void;

	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {

		const { contentEl } = this;

		contentEl.empty();

		contentEl.createEl('h2', { text: 'Add word' });

		const input = contentEl.createEl('input');
		input.type = 'text';
		input.placeholder = 'Enter word';

		const button = contentEl.createEl('button', { text: 'Save' });

		button.onclick = () => {
			this.onSubmit(input.value);
			this.close();
		};
	}

	onClose() {
		this.contentEl.empty();
	}
}

export default class WordPlugin extends Plugin {

	async onload() {

		this.addCommand({
			id: 'add-word',
			name: 'Add word',
			callback: async () => {

				new WordModal(this.app, async (word) => {

					if (!word) {
						new Notice('Empty word');
						return;
					}

					const file = this.app.workspace.getActiveFile();
					if (!file) return;

					const content = await this.app.vault.read(file);

					await this.app.vault.modify(
						file,
						content + `\n- ${word}`
					);

					new Notice('Word added');

				}).open();
			}
		});
	}
}