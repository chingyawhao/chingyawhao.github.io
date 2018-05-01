export const sequencial = (promises:(() => Promise<any>)[]) =>
  new Promise((resolve, reject) => {
    let count = 0
    let results = []

    const iteratePromise = (previousPromise, currentPromise) => 
      previousPromise.then(result => {
        if(count++ !== 0) results = results.concat(result)
        return currentPromise(result, results, count)
      }).catch(error =>
        reject(error)
      )

    promises = promises.concat(() => Promise.resolve())
    promises.reduce(iteratePromise, Promise.resolve(false)).then(() =>
      resolve(results)
    )
  })