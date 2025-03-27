import { IStateManager, StateManagerConfig, StateSubscription, StateChangeEvent } from '../../../common/state/types';

export class RendererStateManager implements IStateManager {
    private state: Map<string, any> = new Map();
    private subscriptions: Map<string, Set<StateSubscription<any>>> = new Map();
    private config: StateManagerConfig;

    constructor(config: StateManagerConfig = {}) {
        this.config = {
            enableDevTools: false,
            ...config
        };

        this.initializeState();
    }

    private initializeState(): void {
        // Initialize state from main process if needed
        if (window.api) {
            window.api.receive('state:sync', (state: Record<string, any>) => {
                Object.entries(state).forEach(([key, value]) => {
                    this.state.set(key, value);
                });
            });
        }
    }

    private notifySubscribers(key: string, newState: any, oldState: any): void {
        const keySubscriptions = this.subscriptions.get(key);
        if (!keySubscriptions) return;

        const event: StateChangeEvent = { key, newState, oldState };

        keySubscriptions.forEach(subscription => {
            try {
                const selectedState = subscription.selector
                    ? subscription.selector(newState)
                    : newState;
                subscription.callback(selectedState, oldState);
            } catch (error) {
                console.error('Error in state subscription callback', {
                    error,
                    subscriptionId: subscription.id,
                    key
                });
            }
        });
    }

    public getState<T>(key: string): T {
        return this.state.get(key) as T;
    }

    public setState<T>(key: string, newState: T | ((prevState: T) => T)): void {
        const oldState = this.state.get(key);
        const updatedState = typeof newState === 'function'
            ? (newState as (prevState: T) => T)(oldState)
            : newState;

        this.state.set(key, updatedState);
        this.notifySubscribers(key, updatedState, oldState);

        // Sync with main process
        if (window.api) {
            window.api.send('state:update', { key, state: updatedState });
        }
    }

    public subscribe<T>(
        key: string,
        callback: (newState: T, oldState: T) => void,
        selector?: (state: any) => T
    ): () => void {
        if (!this.subscriptions.has(key)) {
            this.subscriptions.set(key, new Set());
        }

        const subscription: StateSubscription<T> = {
            id: Math.random().toString(36).substr(2, 9),
            callback,
            selector
        };

        this.subscriptions.get(key)!.add(subscription);

        return () => {
            const keySubscriptions = this.subscriptions.get(key);
            if (keySubscriptions) {
                keySubscriptions.delete(subscription);
                if (keySubscriptions.size === 0) {
                    this.subscriptions.delete(key);
                }
            }
        };
    }

    public resetState(key: string): void {
        const oldState = this.state.get(key);
        this.state.delete(key);
        this.notifySubscribers(key, undefined, oldState);

        // Sync with main process
        if (window.api) {
            window.api.send('state:reset', { key });
        }
    }

    public clearAll(): void {
        const oldStates = new Map(this.state);
        this.state.clear();
        this.subscriptions.clear();
        oldStates.forEach((oldState, key) => {
            this.notifySubscribers(key, undefined, oldState);
        });

        // Sync with main process
        if (window.api) {
            window.api.send('state:clear');
        }
    }

    public getSubscriptions(key: string): Set<StateSubscription<any>> {
        return this.subscriptions.get(key) || new Set();
    }
} 