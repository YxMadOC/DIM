import { t } from 'i18next';
import copy from 'fast-copy';
import * as React from 'react';
import * as _ from 'lodash';
import { DimStore } from '../../inventory/store-types';
import { dimLoadoutService, Loadout, LoadoutClass } from '../../loadout/loadout.service';
import { ArmorSet } from '../types';
import { newLoadout } from '../../loadout/loadout-utils';
import { AppIcon, powerIndicatorIcon } from '../../shell/icons';

/**
 * Renders the Create Loadout and Equip Items buttons for each generated set
 */
export default function GeneratedSetButtons({
  store,
  set,
  onLoadoutSet
}: {
  store: DimStore;
  set: ArmorSet;
  onLoadoutSet(loadout: Loadout): void;
}) {
  // Opens the loadout menu for the generated set
  const openLoadout = () => {
    onLoadoutSet(createLoadout(store.class, set));
  };

  // Automatically equip items for this generated set to the active store
  const equipItems = () => {
    const loadout = createLoadout(store.class, set);
    return dimLoadoutService.applyLoadout(store, loadout, true);
  };

  return (
    <div className="generated-build-buttons">
      <button className="dim-button" onClick={openLoadout}>
        {t('LoadoutBuilder.CreateLoadout')}
      </button>
      <button className="dim-button equip-button" onClick={equipItems}>
        {t('LoadoutBuilder.EquipItems', { name: store.name })}
      </button>
      <span>
        {`T${set.tiers[0].Mobility + set.tiers[0].Resilience + set.tiers[0].Recovery} | `}
        {`${t('LoadoutBuilder.Mobility')} ${set.tiers[0].Mobility} | `}
        {`${t('LoadoutBuilder.Resilience')} ${set.tiers[0].Resilience} | `}
        {`${t('LoadoutBuilder.Recovery')} ${set.tiers[0].Recovery}`}
      </span>
      <span className="light">
        <AppIcon icon={powerIndicatorIcon} /> {set.power / set.armor.length}
      </span>
    </div>
  );
}

/**
 * Create a Loadout object, used for equipping or creating a new saved loadout
 */
function createLoadout(classType: DimStore['class'], set: ArmorSet): Loadout {
  const loadout = newLoadout(
    t('Loadouts.AppliedAuto'),
    copy({
      helmet: [set.armor[0]],
      gauntlets: [set.armor[1]],
      chest: [set.armor[2]],
      leg: [set.armor[3]],
      classitem: [set.armor[4]]
    })
  );
  loadout.classType = LoadoutClass[classType];

  _.each(loadout.items, (val) => {
    val[0].equipped = true;
  });

  return loadout;
}
