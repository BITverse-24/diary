// context/StateContext.tsx
import React, { createContext, useReducer, useContext } from "react";
import stateReducer, { StateType, Entry } from "./StateManager";

const initialState: StateType = {
	password: "",
	entries: []
};

const StateContext = createContext<{
	state: StateType;
	dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => {} });

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(stateReducer, initialState);

	return (
		<StateContext.Provider value={{ state, dispatch }}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateManager = () => useContext(StateContext);
