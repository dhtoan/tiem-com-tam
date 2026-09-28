import type { GameState } from "../../../shared/types/game-state";
import type { EndingId } from "../../../shared/types/endings";

export function transitionToEndless(
  state: GameState,
  ending: EndingId
): GameState {
  const flags = {
    ...state.campaign.flags,
    [`endless_modifier_${ending}`]: true,
  };

  let nextState: GameState = {
    ...state,
    campaign: {
      ...state.campaign,
      day: 31,
      isEndless: true,
      endlessDay: 1,
      flags,
    },
  };

  switch (ending) {
    case "perfect": {
      nextState = {
        ...nextState,
        reputation: {
          ...nextState.reputation,
          rating: Math.min(5.0, Math.max(4.5, nextState.reputation.rating + 0.5)),
        },
        economy: {
          ...nextState.economy,
          shopCash: nextState.economy.shopCash + 500_000,
        },
      };
      break;
    }

    case "family": {
      nextState = {
        ...nextState,
        family: {
          ...nextState.family,
          husbandHelpsInStall: true,
        },
      };
      break;
    }

    case "jd": {
      nextState = {
        ...nextState,
        jd: {
          ...nextState.jd,
          level: Math.max(3, nextState.jd.level),
          stamina: 100,
        },
      };
      break;
    }

    case "neighborhood": {
      nextState = {
        ...nextState,
        neighborhood: {
          ...nextState.neighborhood,
          neighborhoodTrust: Math.min(
            100,
            nextState.neighborhood.neighborhoodTrust + 10
          ),
        },
      };
      break;
    }

    case "husband-finance": {
      nextState.campaign.flags["husband_budget_lock"] = true;
      break;
    }

    case "comeback": {
      nextState.campaign.flags["comeback_resilience_active"] = true;
      break;
    }
  }

  return nextState;
}
