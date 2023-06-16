const mergeArrays = <T>(array1: T[], array2: T[], uniqueKey: keyof T): T[] => {
  const mergedArray = array1.concat(array2)

  const uniqueItems = mergedArray.reduce(
    (uniqueMap: { [key: string]: T }, item: T) => {
      const keyValue = item[uniqueKey]
      // @ts-ignore
      if (!uniqueMap[keyValue]) {
        // @ts-ignore
        uniqueMap[keyValue] = item
      }
      return uniqueMap
    },
    {},
  )

  const uniqueArray = Object.values(uniqueItems)
  return uniqueArray
}

export { mergeArrays }
