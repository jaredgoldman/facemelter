export const wait = async (duration: number) => {
  await new Promise((res) => {
    setTimeout(res, duration);
  });
};

export const asyncForEach = async (array: Array<any>, callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    try {
      await callback(array[index], index, array);
    } catch (error) {
      console.log('ERROR', error);
    }
  }
};

export const getNextRoundType = (length: number) => {
  if (length === 16) return 'roundOne';
  if (length === 8) return 'roundTwo';
  if (length === 4) return 'semiFinals';
  if (length === 2) return 'finals';
  else return 'gameover';
};
