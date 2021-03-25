import boxpack from "boxpack";

export const layout = async function (tiles) {
  const layout = boxpack().pack(tiles);

  return { layout };
};
