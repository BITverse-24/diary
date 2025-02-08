// context/StateReducer.ts
export type StateType = {
	password: string
};

type ActionType = { type: "PASSWORD"; payload: string }

const stateManager = (state: StateType, action: ActionType): StateType => {
	switch (action.type) {
		case "PASSWORD":
			return { ...state, password: action.payload };
		default:
			return state;
	}
};

export default stateManager;
