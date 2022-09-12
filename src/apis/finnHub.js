import axios from 'axios';

const TOKEN = 'ccetglqad3ifd4q5u9k0';

export default axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: {
    token: TOKEN,
  },
});
