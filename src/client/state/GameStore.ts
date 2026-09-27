import type { GameState } from "../../shared/types/game-state";

export type ActionFn = (state: GameState) => GameState;
export type StateListener = (state: GameState) => void;

export class GameStore {
  private state: GameState;
  private listeners: Set<StateListener> = new Set();

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  public getState(): GameState {
    return this.state;
  }

  public dispatch(action: ActionFn): void {
    const prevState = this.state;
    const nextState = action(prevState);
    if (nextState !== prevState) {
      this.state = {
        ...nextState,
        meta: {
          ...nextState.meta,
          updatedAt: Date.now(),
        },
      };
      this.notify();
    }
  }

  public replaceState(newState: GameState): void {
    this.state = {
      ...newState,
      meta: {
        ...newState.meta,
        updatedAt: Date.now(),
      },
    };
    this.notify();
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error("Error in GameStore subscriber:", err);
      }
    }
  }
}
