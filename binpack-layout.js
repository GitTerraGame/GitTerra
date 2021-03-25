import pack from "bin-pack";

export const layout = async function (tiles) {
  const layout = pack(tiles);

  return { layout };
};
