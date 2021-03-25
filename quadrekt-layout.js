import quadrekt from "quadrekt";

export const layout = async function (tiles, options = { maxWidth: null }) {
  let maxWidth = options.maxWidth;

  if (!maxWidth) {
    maxWidth = Math.ceil(Math.sqrt(tiles.length));
  }

  const layout = await quadrekt(tiles, { maxWidth });

  return { layout };
};
