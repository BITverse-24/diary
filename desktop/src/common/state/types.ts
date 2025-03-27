// State update callback type
export type StateUpdateCallback<T> = (newState: T, oldState: T) => void;

// State subscription type
export interface StateSubscription<T> {
    id: string;
    callback: StateUpdateCallback<T>;
    selector?: (state: any) => T;
}

// State manager interface
export interface IStateManager {
    getState<T>(key: string): T;
    setState<T>(key: string, newState: T | ((prevState: T) => T)): void;
    subscribe<T>(key: string, callback: StateUpdateCallback<T>, selector?: (state: any) => T): () => void;
    resetState(key: string): void;
    clearAll(): void;
}

// State change event type
export interface StateChangeEvent {
    key: string;
    newState: any;
    oldState: any;
}

// State persistence options
export interface StatePersistenceOptions {
    enabled: boolean;
    storageKey?: string;
    debounceTime?: number;
}

// State manager configuration
export interface StateManagerConfig {
    persistence?: StatePersistenceOptions;
    maxHistory?: number;
    enableDevTools?: boolean;
} 