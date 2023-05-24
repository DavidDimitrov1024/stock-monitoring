import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import StockList from "./components/StockList"
import './App.css'

export default function App() {

  const [stockListData, setStockListData] = useState(() => JSON.parse(localStorage.getItem("stocks")))
  const ref = useRef(null);
  let stockName = '';  

  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(stockListData))
  }, [stockListData]);

  function fetchStockData(name) {
    const stockTick = name;
    const date = new Date();
    const formatDate = `${date.getFullYear()}-${date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()}-${date.getDay() < 10 ? '0' + date.getDay() : date.getDay()}`
    console.log(formatDate)
    const link = 
      `https://api.polygon.io/v2/aggs/ticker/${stockTick}/range/1/month/2020-01-09/${formatDate}?adjusted=true&sort=asc&limit=5000&apiKey=Rt_Xvwhy10Q2VopfNpQRhZgOgQUUWjLV`
    fetch(link)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const transformedData = data.results.map(stockData => {
          return {
            ticker: data.ticker, 
            close: stockData.c
          }
        })
        setStockListData(prev => {
          return [...prev, transformedData]
        })
      })
  }


  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    
    stockName = formJson.stockName;
    fetchStockData(stockName);
    
    ref.current.value = "";
  }

  console.log(stockListData)

  return (
    <div>
      <Navbar />
      <form method = "post" onSubmit={handleSubmit}>
        <button> Add </button>
        <input 
          name = "stockName"
          ref = {ref}
        />
      </form>
      
    </div>
  )
}