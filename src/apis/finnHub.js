import axios from 'axios';

export default axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: {
    token: process.env.REACT_APP_TOKEN,
  },
});
