import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import StockList from "./components/StockList"
import './App.css'

export default function App() {
  const [stockListData, setStockListData] = useState(
    () => JSON.parse(localStorage.getItem("stocks")) || []
  )
  const [currStockTicker, setCurrStockTicker] = useState(
    (stockListData[0] && stockListData[0].ticker) || ""
  )
  const ref = useRef(null);
  let stockName = '';  
  const empty = []

  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(stockListData))
    if (stockListData[0] == {}) {
      stockListData.unshift();
    }
  }, [stockListData])

  function deleteStock(event, stockTicker) {
    event.stopPropagation();
    setStockListData(prev => prev.filter(stock => stock.ticker != stockTicker))
  }

  function fetchStockData(name) {
    
    const stockTick = name;
    const timeStamp = 'minute';
    const multiplier = '5';
    const date = new Date();
    const formatDateEnd = 
      `${date.getFullYear()}-${date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()}-${date.getDay() < 10 ? '0' + date.getDay() : date.getDay()}`;
    const formatDateStart = '2023-01-01';
    const link = 
      `https://api.polygon.io/v2/aggs/ticker/${stockTick}/range/${multiplier}/${timeStamp}/2020-01-09/${formatDateEnd}?adjusted=true&sort=asc&limit=5000&apiKey=Rt_Xvwhy10Q2VopfNpQRhZgOgQUUWjLV`
    fetch(link)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setStockListData(prev => {
          if (stockListData.length != 0){
          return [{
              ...prev,
              ticker: data.ticker,
              result: data.results
            }]
          } else {
            return [{ 
              ticker: data.ticker,
              result: data.results
            }]
          }
        })
        setCurrStockTicker(data.ticker)
      })
  }

  function findCurrStockTicker() {
    const currStock = stockListData.find(list => {
      return list.ticker === currStockTicker;
    }) || stockListData[0].ticker;

    return currStock.ticker;
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

  function deleteStock(event, stockTicker) {
    event.stopPropagation();
    setStockListData(prev => prev.filter(stock => stock.ticker !== stockTicker))
  }

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
      {stockListData[0]?.ticker &&
        <StockList 
          stockListData = {stockListData}
          currStockTicker = {findCurrStockTicker()}
          setCurrStockTicker = {setCurrStockTicker}
          deleteStock = {deleteStock}
          fetchStockData = {fetchStockData}
        />
      }
    </div>
  )
}