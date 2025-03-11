// context/StateReducer.ts
export type StateType = {
	password: string;
	entries: Entry[];
};

export type Entry = {
	title: string
	date: string
	content: string
}

type ActionType =
	| { type: "PASSWORD"; payload: string }
	| { type: "ENTRY"; payload: Entry[] }

const StateManager = (state: StateType, action: ActionType): StateType => {
	switch (action.type) {
		case "PASSWORD":
			return { ...state, password: action.payload };
		case "ENTRY":
			return { ...state, entries: action.payload };
		default:
			return state;
	}
};

export default StateManager;
