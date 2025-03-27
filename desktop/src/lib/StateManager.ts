export type StateType = {
	password: string;
	entries: Entry[];
	dbConfig?: DatabaseConfig;
};

export type Entry = {
	title: string;
	date: string;
	content: string;
};

export type DatabaseConfig = {
	type: "aws" | "mongo";
	config: AwsConfig | MongoConfig;
};

export type AwsConfig = {
	accessKeyId: string;
	secretKey: string;
	region: string;
};

export type MongoConfig = {
	connectionString: string;
};

export class StateManager {
	private state: StateType;

	constructor(initialState: StateType) {
		this.state = initialState;
	}

	getState(): StateType {
		return this.state;
	}

	setState(newState: StateType): void {
		this.state = newState;
	}

	getPassword(): string {
		return this.state.password;
	}

	updatePassword(newPassword: string): void {
		this.state = { ...this.state, password: newPassword };
	}

	getEntries(): Entry[] {
		return this.state.entries;
	}

	setEntries(entries: Entry[]): void {
		this.state = { ...this.state, entries };
	}

	addEntry(entry: Entry): void {
		this.state = { ...this.state, entries: [...this.state.entries, entry] };
	}

	updateEntry(index: number, entry: Entry): void {
		if (index < 0 || index >= this.state.entries.length) {
			throw new Error("Entry index out of bounds");
		}
		const updatedEntries = this.state.entries.map((e, i) => (i === index ? entry : e));
		this.state = { ...this.state, entries: updatedEntries };
	}

	removeEntry(index: number): void {
		if (index < 0 || index >= this.state.entries.length) {
			throw new Error("Entry index out of bounds");
		}
		const updatedEntries = this.state.entries.filter((_, i) => i !== index);
		this.state = { ...this.state, entries: updatedEntries };
	}

	getDbConfig(): DatabaseConfig | undefined {
		return this.state.dbConfig;
	}

	setDbConfig(config: DatabaseConfig): void {
		this.state = { ...this.state, dbConfig: config };
	}

	clearDbConfig(): void {
		this.state = { ...this.state, dbConfig: undefined };
	}
}

export default new StateManager({
	password: '',
	entries: [],
	dbConfig: undefined,
});
