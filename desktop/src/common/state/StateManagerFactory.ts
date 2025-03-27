import { StateManager } from '../../main/state/StateManager';
import { RendererStateManager } from '../../renderer/src/state/StateManager';
import { StateManagerConfig } from './types';

let mainStateManager: StateManager | null = null;
let rendererStateManager: RendererStateManager | null = null;

export function createMainStateManager(config?: StateManagerConfig): StateManager {
    if (!mainStateManager) {
        mainStateManager = new StateManager(config);
    }
    return mainStateManager;
}

export function createRendererStateManager(config?: StateManagerConfig): RendererStateManager {
    if (!rendererStateManager) {
        rendererStateManager = new RendererStateManager(config);
    }
    return rendererStateManager;
}

export function getMainStateManager(): StateManager {
    if (!mainStateManager) {
        throw new Error('Main state manager not initialized');
    }
    return mainStateManager;
}

export function getRendererStateManager(): RendererStateManager {
    if (!rendererStateManager) {
        throw new Error('Renderer state manager not initialized');
    }
    return rendererStateManager;
}

export function resetStateManagers(): void {
    mainStateManager = null;
    rendererStateManager = null;
} 