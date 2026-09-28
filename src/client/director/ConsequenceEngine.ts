import type { GameState } from "../../shared/types/game-state";
import type { Consequence } from "../../shared/types/events";
import { adjustNeighborhoodTrust } from "../systems/neighborhood/neighborhood";
import { awardJDXp } from "../systems/jd/jd";
import { scheduleFollowUp } from "./followUps";

export function applyConsequences(
  state: GameState,
  consequences: Consequence[]
): GameState {
  let nextState: GameState = { ...state };

  for (const c of consequences) {
    switch (c.type) {
      case "cash": {
        const newCash = Math.max(0, nextState.economy.shopCash + c.amount);
        nextState = {
          ...nextState,
          economy: {
            ...nextState.economy,
            shopCash: newCash,
            totalRevenue:
              c.amount > 0
                ? nextState.economy.totalRevenue + c.amount
                : nextState.economy.totalRevenue,
            totalExpenses:
              c.amount < 0
                ? nextState.economy.totalExpenses + Math.abs(c.amount)
                : nextState.economy.totalExpenses,
          },
        };
        break;
      }

      case "stock": {
        const currentQty = nextState.inventory.items[c.ingredientId] ?? 0;
        const newQty = Math.max(0, currentQty + c.quantity);
        nextState = {
          ...nextState,
          inventory: {
            ...nextState.inventory,
            items: {
              ...nextState.inventory.items,
              [c.ingredientId]: newQty,
            },
          },
        };
        break;
      }

      case "trust": {
        nextState = {
          ...nextState,
          neighborhood: {
            ...nextState.neighborhood,
            neighborhoodTrust: adjustNeighborhoodTrust(
              nextState.neighborhood.neighborhoodTrust,
              c.delta
            ),
          },
        };
        break;
      }

      case "reputation": {
        const newRating = Math.max(
          0.0,
          Math.min(5.0, Number((nextState.reputation.rating + c.delta).toFixed(2)))
        );
        nextState = {
          ...nextState,
          reputation: {
            ...nextState.reputation,
            rating: newRating,
          },
        };
        break;
      }

      case "familyTrust": {
        const newTrust = Math.max(
          0,
          Math.min(100, Math.round(nextState.family.familyTrust + c.delta))
        );
        nextState = {
          ...nextState,
          family: {
            ...nextState.family,
            familyTrust: newTrust,
          },
        };
        break;
      }

      case "husbandConfidence": {
        const newConfidence = Math.max(
          0,
          Math.min(100, Math.round(nextState.family.husbandConfidence + c.delta))
        );
        nextState = {
          ...nextState,
          family: {
            ...nextState.family,
            husbandConfidence: newConfidence,
          },
          debt: {
            ...nextState.debt,
            husbandConfidence: newConfidence,
          },
        };
        break;
      }

      case "jdStamina": {
        const newStamina = Math.max(
          0,
          Math.min(100, Math.round(nextState.jd.stamina + c.delta))
        );
        nextState = {
          ...nextState,
          jd: {
            ...nextState.jd,
            stamina: newStamina,
          },
        };
        break;
      }

      case "jdMood": {
        const newMood = Math.max(
          0,
          Math.min(100, Math.round(nextState.jd.mood + c.delta))
        );
        nextState = {
          ...nextState,
          jd: {
            ...nextState.jd,
            mood: newMood,
          },
        };
        break;
      }

      case "jdXp": {
        nextState = {
          ...nextState,
          jd: awardJDXp(nextState.jd, nextState.jd.assignedRole, c.delta),
        };
        break;
      }

      case "flag": {
        nextState = {
          ...nextState,
          campaign: {
            ...nextState.campaign,
            flags: {
              ...nextState.campaign.flags,
              [c.key]: c.value,
            },
          },
        };
        break;
      }

      case "scheduleFollowUp": {
        nextState = scheduleFollowUp(nextState, {
          targetDay: nextState.campaign.day + c.delayDays,
          eventId: c.eventId,
        });
        break;
      }

      case "unlockUpgrade": {
        if (!nextState.economy.upgrades.includes(c.upgradeId)) {
          nextState = {
            ...nextState,
            economy: {
              ...nextState.economy,
              upgrades: [...nextState.economy.upgrades, c.upgradeId],
            },
          };
        }
        break;
      }

      case "missedInstallment": {
        const increment = c.count ?? 1;
        nextState = {
          ...nextState,
          debt: {
            ...nextState.debt,
            missedInstallments: nextState.debt.missedInstallments + increment,
          },
        };
        break;
      }
    }
  }

  return nextState;
}
