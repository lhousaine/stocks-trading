import { createContext, useEffect, useState } from 'react';

export const WatchListContext = createContext();

export const WatchListContextProvider = (props) => {
  const [watchList, setWatchList] = useState(
    localStorage.getItem('watchList')?.split(',') || [
      'GOOGL',
      'MSFT',
      'AMZN',
      'TSLA',
    ]
  );

  const addStock = (stockSymbol) => {
    if (watchList.includes(stockSymbol)) {
      return;
    }
    setWatchList([...watchList, stockSymbol]);
  };
  const deleteStock = (stock) => {
    setWatchList(watchList.filter((element) => element !== stock));
  };
  useEffect(() => {
    localStorage.setItem('watchList', watchList);
  }, [watchList]);

  return (
    <WatchListContext.Provider
      value={{ watchList, setWatchList, addStock, deleteStock }}
    >
      {props.children}
    </WatchListContext.Provider>
  );
};
