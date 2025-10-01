// System Module Imports
import { ACTION_TYPE, ITEM_TYPE } from "./constants.js";
import { Utils } from "./utils.js";

export let ActionHandler = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  /**
   * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
   */
  ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
    /**
     * Build system actions
     * Called by Token Action HUD Core
     * @override
     * @param {array} groupIds
     */ a;
    async buildSystemActions(groupIds) {
      // Set actor and token variables
      this.actors = !this.actor ? this._getActors() : [this.actor];
      this.actorType = this.actor?.type;

      // Settings
      this.displayUnequipped = Utils.getSetting("displayUnequipped");

      // Set items variable
      if (this.actor) {
        let items = this.actor.items;
        items = coreModule.api.Utils.sortItemsByName(items);
        this.items = items;
      }

      if (this.actorType === "character") {
        this.#buildCharacterActions();
      } else if (!this.actor) {
        this.#buildMultipleTokenActions();
      }
    }

    /**
     * Build character actions
     * @private
     */
    #buildCharacterActions() {
      this.#buildAbilities();
      this.#buildSaves();
      this.#buildAttacks();
      this.#buildOther();
      this.#buildInventory();
    }

    /**
     * Build multiple token actions
     * @private
     * @returns {object}
     */
    #buildMultipleTokenActions() {}

    async #buildAbilities() {
      if (!this.actor) return;

      const data = this.actor.system;
      // const abilities = data.abilities;
      const groupData = { id: "abilities", type: "system" };
      const actions = [
        {
          id: `${this.actor.id}-str`,
          name: "STR",
          //icon1: `<i class="fa-solid fa-hand-fist" data-tooltip="Strength"></i>`,
          tooltip: "Strength",
          listName: "Ability: Strength",
          encodedValue: "ability|str",
        },
        {
          id: `${this.actor.id}-end`,
          name: "END",
          //icon1: `<i class="fa-solid fa-heartbeat" data-tooltip="Endurance"></i>`,
          tooltip: "Endurance",
          listName: "Ability: Endurance",
          encodedValue: "ability|end",
        },
        {
          id: `${this.actor.id}-agi`,
          name: "AGI",
          //icon1: `<i class="fa-solid fa-person-running" data-tooltip="Agility"></i>`,
          tooltip: "Agility",
          listName: "Ability: Agility",
          encodedValue: "ability|agi",
        },
        {
          id: `${this.actor.id}-cha`,
          name: "CHA",
          tooltip: "Charisma",
          listName: "Ability: Charisma",
          encodedValue: "ability|cha",
        },
        {
          id: `${this.actor.id}-aur`,
          name: "AUR",
          tooltip: "Aura",
          listName: "Ability: Aura",
          encodedValue: "ability|aur",
        },
        {
          id: `${this.actor.id}-tho`,
          name: "THO",
          tooltip: "Thought",
          listName: "Ability: Thought",
          encodedValue: "ability|tho",
        },
      ];
      this.addActions(actions, groupData);
    }

    async #buildSaves() {
      if (!this.actor) return;

      const data = this.actor.system;
      console.log(this.actor.sheet);
      // const abilities = data.abilities;
      const groupData = { id: "saves", type: "system" };
      const actions = [
        {
          id: `${this.actor.id}-save-str`,
          name: "STR",
          icon1: `<i class="fa-solid fa-hand-fist"></i>`,
          tooltip: "Strength Saving Throw",
          listName: "Save: Strength",
          encodedValue: "save|str",
        },
        {
          id: `${this.actor.id}-save-end`,
          name: "END",
          icon1: `<i class="fa-solid fa-heartbeat"></i>`,
          tooltip: "Endurance Saving Throw",
          listName: "Save: Endurance",
          encodedValue: "save|end",
        },
        {
          id: `${this.actor.id}-save-agi`,
          name: "AGI",
          icon1: `<i class="fa-solid fa-person-running"></i>`,
          tooltip: "Agility Saving Throw",
          listName: "Save: Agility",
          encodedValue: "save|agi",
        },
        {
          id: `${this.actor.id}-save-cha`,
          name: "CHA",
          icon1: `<i class="fa-solid fa-clover"></i>`,
          tooltip: "Charisma Saving Throw",
          listName: "Save: Charisma",
          encodedValue: "save|cha",
        },
        {
          id: `${this.actor.id}-save-aur`,
          name: "AUR",
          icon1: `<i class="fa-solid fa-splotch"></i>`,
          tooltip: "Aura Saving Throw",
          listName: "Save: Aura",
          encodedValue: "save|aur",
        },
        {
          id: `${this.actor.id}-save-tho`,
          name: "THO",
          icon1: `<i class="fa-solid fa-cloud"></i>`,
          tooltip: "Thought Saving Throw",
          listName: "Save: Thought",
          encodedValue: "save|tho",
        },
      ];
      this.addActions(actions, groupData);
    }

    async #buildAttacks() {
      if (!this.actor) return;

      const data = this.actor.system;
      // const abilities = data.abilities;
      const groupData = { id: "attacks", type: "system" };
      const actions = [
        {
          id: `${this.actor.id}-melee`,
          name: "Melee",
          listName: "Attack: Melee",
          tooltip: "",
          encodedValue: "attack|melee",
        },
        {
          id: `${this.actor.id}-ranged`,
          name: "Ranged",
          listName: "Attack: Ranged",
          tooltip: "",
          encodedValue: "attack|ranged",
        },
        {
          id: `${this.actor.id}-fantascience`,
          name: "Fantascience",
          listName: "Attack: Fantascience",
          tooltip: "",
          encodedValue: "attack|fantascience",
        },
        {
          id: `${this.actor.id}-oldtech`,
          name: "Oldtech",
          listName: "Attack: Oldtech",
          tooltip: "",
          encodedValue: "attack|oldtech",
        },
      ];
      this.addActions(actions, groupData);
    }

    async #buildOther() {
      if (!this.actor) return;

      //const data = this.actor.system;
      const hero_dice = this.actor.system.hero_dice;
      const groupData = { id: "player", type: "system" };

      const actions = [
        {
          id: `${this.actor.id}-reaction`,
          name: "Reaction",
          icon1: `<i class="fa-solid fa-masks-theater"></i>`,
          tooltip: "Reaction",
          listName: "Other: Reaction",
          encodedValue: "reaction|reaction",
        },
        {
          id: `${this.actor.id}-hero-dice`,
          name: `Hero Dice: ${hero_dice.value}/${hero_dice.max}`,
          icon1: `<i class="fa-solid fa-dice-d6"></i>`,
          tooltip: "Hero Dice",
          listName: "Other: Hero Dice",
          encodedValue: "heroichealing|heroichealing",
        },
      ];

      this.addActions(actions, groupData);
    }

    /**
     * Build inventory
     * @private
     */
    async #buildInventory() {
      if (this.items.size === 0) return;

      const actionTypeId = "item";
      const inventoryMap = new Map();

      for (const [itemId, itemData] of this.items) {
        const system = itemData.system;
        const type = system.type;
        const equipped = system.readied;

        if (equipped || this.displayUnequipped) {
          const typeMap = inventoryMap.get(type) ?? new Map();
          typeMap.set(itemId, itemData);
          inventoryMap.set(type, typeMap);
        }
      }

      for (const [type, typeMap] of inventoryMap) {
        const groupId = ITEM_TYPE[type]?.groupId;

        if (!groupId) continue;

        const groupData = { id: groupId, type: "system" };

        // Get actions
        const actions = [...typeMap].map(([itemId, itemData]) => {
          const id = itemId;
          const name = itemData.getNameTitle();
          const actionTypeName = coreModule.api.Utils.i18n(
            ACTION_TYPE[actionTypeId]
          );
          const listName = `${
            actionTypeName ? `${actionTypeName}: ` : ""
          }${name}`;
          const encodedValue = [actionTypeId, id].join(this.delimiter);
          const status = itemData.system.status;
          const resources = itemData.system.resources;

          const brokenItem = status === 'broken';
          const runOutItem = resources === 'run_out';

          let icon1 = status === 'notched' ? `<i class="fa fa-hammer"></i>` : status === 'broken' ? `<i class="fa fa-ban"></i>` : ''; 
          let icon2 = resources === 'running_low' ? 
          `<i class="fa-solid fa-battery-quarter"></i>` :
           resources === 'run_out' ? `<i class="fa-solid fa-battery-empty"></i>` : ''; 
          let icon3 = itemData.system.readied ? '<i class="fa fa-shield"></i>' : '';

          return {
            id,
            name,
            img: coreModule.api.Utils.getImage(itemData),
            icon1,
            icon2,
            icon3,
            cssClass: (brokenItem || runOutItem) ? 'disabled': '', 
            tooltip: itemData.getInventoryTitle(),
            listName,
            encodedValue,
          };
        });

        // TAH Core method to add actions to the action list
        this.addActions(actions, groupData);
      }
    }
  };
});
