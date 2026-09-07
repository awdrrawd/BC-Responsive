import { clone, ID } from '../core/model.js';
export const ANIMATION_GROUPS = ['HairAccessory2', 'TailStraps', 'Wings'];
export function animationState(track, state) {
  return state === 'B' && track.stateB.sameAsset
    ? { ...track.stateB, asset: track.stateA.asset }
    : track['state' + state];
}
export function snapshotItem(item) {
  return item
    ? {
        asset: item.Asset.Name,
        color: clone(item.Color ?? 'Default'),
        property: clone(item.Property ?? {}),
        craft: clone(item.Craft ?? null),
      }
    : null;
}
export function wearState(host, group, state) {
  if (!state) {
    host.InventoryRemove?.(host.Player, group, false);
    return;
  }
  const worn = host.InventoryWear(
    host.Player,
    state.asset,
    group,
    state.color ?? 'Default',
    undefined,
    undefined,
    undefined,
    false,
  );
  const item = worn ?? host.InventoryGet(host.Player, group);
  if (item) {
    if (state.property !== undefined) item.Property = clone(state.property ?? {});
    if (state.craft) item.Craft = clone(state.craft);
    else delete item.Craft;
  }
}

export function createPreviewCharacter(host, name) {
  const preview = host.CharacterLoadSimple(name);
  preview.Name = host.Player.Name;
  preview.AssetFamily = host.Player.AssetFamily;
  preview.Appearance = host.Player.Appearance.map((item) => ({
    ...item,
    Color: clone(item.Color ?? 'Default'),
    Property: clone(item.Property ?? {}),
    ...(item.Craft ? { Craft: clone(item.Craft) } : {}),
  }));
  return preview;
}

// The native wardrobe owns rendering, color controls, extended properties and coordinates.
export async function editAppearanceState(host, group, state, done) {
  if (typeof host.CharacterAppearanceLoadCharacter !== 'function') throw Error('Wardrobe unavailable');
  const screen = host.CommonGetScreen();
  const informationReturnScreen = host.InformationSheetReturnScreen
    ? [...host.InformationSheetReturnScreen]
    : undefined;
  const returnToSettings = async () => {
    await host.CommonSetScreen(...screen);
    await host.PreferenceSubscreenExtensionsOpen?.(ID, informationReturnScreen);
    // PreferenceOpenSubscreen may itself visit InformationSheet while reopening.
    if (informationReturnScreen) host.InformationSheetReturnScreen = [...informationReturnScreen];
  };
  const preview = createPreviewCharacter(host, 'Responsive_Liko_StatePreview');
  const previewHost = Object.create(host);
  previewHost.Player = preview;
  const restore = () => {
    preview.FocusGroup = null;
  };
  try {
    wearState(previewHost, group, state);
    host.CharacterRefresh(preview, false);
    await host.CharacterAppearanceLoadCharacter(preview, async (accepted) => {
      const saved = accepted ? snapshotItem(host.InventoryGet(preview, group)) : null;
      restore();
      await returnToSettings();
      done(saved);
    });
  } catch (error) {
    restore();
    await returnToSettings();
    throw error;
  }
}
