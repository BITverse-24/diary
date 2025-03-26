// context/StateReducer.ts
export type StateType = {
	password: string;
	entries: Entry[];
	dbConfig?: DatabaseConfig;
};

export type Entry = {
	title: string,
    content: string,
    createdAt: Date,
    characters: number
}

export type DatabaseConfig = {
	type: "aws" | "mongo";
	config: AwsConfig | MongoConfig;
}

export type AwsConfig = {
	accessKeyId: string;
	secretKey: string;
	region: string;
}

export type MongoConfig = {
	connectionString: string;
}

type ActionType =
	| { type: "PASSWORD"; payload: string }
	| { type: "ENTRY"; payload: Entry[] }
	| { type: "DB_CONFIG"; payload: DatabaseConfig }

const StateManager = (state: StateType, action: ActionType): StateType => {
	switch (action.type) {
		case "PASSWORD":
			return { ...state, password: action.payload };
		case "ENTRY":
			return { ...state, entries: action.payload };
		case "DB_CONFIG":
			return { ...state, dbConfig: action.payload };
		default:
			return state;
	}
};

export default StateManager;
