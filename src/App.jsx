import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import StockList from "./components/StockList"
import './App.css'

export default function App() {

  const [stockName, setStockName] = useState('');
  const ref = useRef(null);
  const stockListData = [{}]

  function fetchStockData(name) {
    const stockTick = name;
    const link = `https://api.polygon.io/v1/open-close/${stockTick}/2023-01-09?adjusted=true&apiKey=Rt_Xvwhy10Q2VopfNpQRhZgOgQUUWjLV`
    fetch(link)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        stockListData.push(data)
        console.log(stockListData)
      })
  }


  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    
    setStockName(formJson.stockName);
    
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
      <StockList stockListData = {stockListData}/>
    </div>
  )
}