import { IStateManager, StateManagerConfig, StateSubscription, StateChangeEvent } from '../../common/state/types';
import { logger } from '../utils/logger';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export class StateManager implements IStateManager {
    private state: Map<string, any> = new Map();
    private subscriptions: Map<string, Set<StateSubscription<any>>> = new Map();
    private history: Map<string, any[]> = new Map();
    private config: StateManagerConfig;
    private persistenceDebounceTimer: NodeJS.Timeout | null = null;

    constructor(config: StateManagerConfig = {}) {
        this.config = {
            persistence: {
                enabled: true,
                storageKey: 'app-state',
                debounceTime: 1000
            },
            maxHistory: 50,
            enableDevTools: false,
            ...config
        };

        this.initializeState();
    }

    private initializeState(): void {
        if (this.config.persistence?.enabled) {
            this.loadPersistedState();
        }
    }

    private getStoragePath(): string {
        return path.join(app.getPath('userData'), 'state.json');
    }

    private loadPersistedState(): void {
        try {
            const storagePath = this.getStoragePath();
            if (fs.existsSync(storagePath)) {
                const data = fs.readFileSync(storagePath, 'utf8');
                const persistedState = JSON.parse(data);
                Object.entries(persistedState).forEach(([key, value]) => {
                    this.state.set(key, value);
                });
                logger.info('Loaded persisted state');
            }
        } catch (error) {
            logger.error('Failed to load persisted state', { error });
        }
    }

    private persistState(): void {
        if (!this.config.persistence?.enabled) return;

        if (this.persistenceDebounceTimer) {
            clearTimeout(this.persistenceDebounceTimer);
        }

        this.persistenceDebounceTimer = setTimeout(() => {
            try {
                const storagePath = this.getStoragePath();
                const stateObject = Object.fromEntries(this.state);
                fs.writeFileSync(storagePath, JSON.stringify(stateObject, null, 2));
                logger.debug('Persisted state updated');
            } catch (error) {
                logger.error('Failed to persist state', { error });
            }
        }, this.config.persistence.debounceTime || 1000);
    }

    private updateHistory(key: string, newState: any): void {
        if (!this.history.has(key)) {
            this.history.set(key, []);
        }

        const keyHistory = this.history.get(key)!;
        keyHistory.push(newState);

        if (keyHistory.length > (this.config.maxHistory || 50)) {
            keyHistory.shift();
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
                logger.error('Error in state subscription callback', {
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
        this.updateHistory(key, updatedState);
        this.notifySubscribers(key, updatedState, oldState);
        this.persistState();
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
        this.persistState();
    }

    public clearAll(): void {
        const oldStates = new Map(this.state);
        this.state.clear();
        this.subscriptions.clear();
        this.history.clear();
        oldStates.forEach((oldState, key) => {
            this.notifySubscribers(key, undefined, oldState);
        });
        this.persistState();
    }

    public getHistory(key: string): any[] {
        return this.history.get(key) || [];
    }

    public getSubscriptions(key: string): Set<StateSubscription<any>> {
        return this.subscriptions.get(key) || new Set();
    }
} 