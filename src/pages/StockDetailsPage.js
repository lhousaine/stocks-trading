import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import finnHub from '../apis/finnHub';
import { StockChart } from '../components/StockChart';
import { StockData } from '../components/StockData';
import { BsArrowUpLeft } from 'react-icons/bs';

const formatData = (data) => {
  return data.t.map((el, index) => {
    return {
      x: el * 1000,
      y: Math.floor(data.c[index]),
    };
  });
};

export const StockDetailsPage = () => {
  const [chartData, setChartData] = useState(null);
  const { symbol } = useParams();
  const navigate = useNavigate();

  const handleReturnToOverviewPage = () => {
    navigate('/');
  };
  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      const currentTime = Math.floor(date.getTime() / 1000);
      let oneDay;
      if (date.getDay() === 6) {
        oneDay = currentTime - 2 * 24 * 60 * 60;
      } else if (date.getDay() === 0) {
        oneDay = currentTime - 3 * 24 * 60 * 60;
      } else {
        oneDay = currentTime - 24 * 60 * 60;
      }
      const oneWeek = currentTime - 7 * 24 * 60 * 60;
      const oneYear = currentTime - 365 * 24 * 60 * 60;
      try {
        const responses = await Promise.all([
          finnHub.get('/stock/candle', {
            params: {
              symbol,
              from: oneDay,
              to: currentTime,
              resolution: 30,
            },
          }),
          finnHub.get('/stock/candle', {
            params: {
              symbol,
              from: oneWeek,
              to: currentTime,
              resolution: 60,
            },
          }),
          finnHub.get('/stock/candle', {
            params: {
              symbol,
              from: oneYear,
              to: currentTime,
              resolution: 'W',
            },
          }),
        ]);
        setChartData({
          day: formatData(responses[0].data),
          week: formatData(responses[1].data),
          year: formatData(responses[2].data),
        });
      } catch (err) {}
    };
    fetchData();
  }, [symbol]);

  return (
    <div className='container'>
      <div>
        <button
          className='mt-5 btn btn-primary'
          onClick={handleReturnToOverviewPage}
        >
          <BsArrowUpLeft />
          <span>To Overview Page</span>
        </button>
      </div>
      {chartData && (
        <div>
          <StockChart chartData={chartData} symbol={symbol} />
          <StockData symbol={symbol} />
        </div>
      )}
    </div>
  );
};
