import { useState, useEffect, useContext } from 'react';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import finnHub from '../apis/finnHub';
import { WatchListContext } from '../context/watchListContext';

export const StockList = () => {
  const [stock, setStock] = useState();
  const { watchList, deleteStock } = useContext(WatchListContext);
  const navigate = useNavigate();

  const changeColor = (change) => {
    if (change > 0) {
      return 'success';
    }
    return 'danger';
  };
  const renderIcon = (change) => {
    return change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />;
  };

  const handleStockSelect = (symbol) => {
    navigate(`detail/${symbol}`);
  };
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          watchList.map((stockSymbol) =>
            finnHub.get('quote', {
              params: {
                symbol: stockSymbol,
              },
            })
          )
        );
        const data = responses.map((response) => {
          return {
            data: response.data,
            symbol: response.config.params.symbol,
          };
        });
        if (isMounted) {
          setStock(data);
        }
      } catch (err) {}
    };
    fetchData();
    return () => (isMounted = false);
  }, [watchList]);
  return stock?.length ? (
    <div>
      <table className='table hover mt-5'>
        <thead style={{ color: 'rgb(79,89,102)' }}>
          <tr>
            <th scope='col'>Name</th>
            <th scope='col'>Current price</th>
            <th scope='col'>Change</th>
            <th scope='col'>Percent change</th>
            <th scope='col'>High price</th>
            <th scope='col'>Low price</th>
            <th scope='col'>Open price</th>
            <th scope='col'>Previous close price</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((stockData) => {
            return (
              <tr
                style={{ cursor: 'pointer' }}
                onClick={() => handleStockSelect(stockData.symbol)}
                className='table-row'
                key={stockData.symbol}
              >
                <th scope='row'>{stockData.symbol}</th>
                <td>{stockData.data.c}</td>
                <td className={`text-${changeColor(stockData.data.d)}`}>
                  {stockData.data.d}
                  {renderIcon(stockData.data.d)}
                </td>
                <td className={`text-${changeColor(stockData.data.dp)}`}>
                  {stockData.data.dp}
                  {renderIcon(stockData.data.dp)}
                </td>
                <td>{stockData.data.h}</td>
                <td>{stockData.data.l}</td>
                <td>{stockData.data.o}</td>
                <td>
                  {stockData.data.pc}{' '}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStock(stockData.symbol);
                    }}
                    className='btn btn-danger dtn-sm ml-3 d-inline-block delete-button'
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    'Loading...'
  );
};
