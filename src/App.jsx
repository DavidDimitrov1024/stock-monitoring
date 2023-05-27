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
  let empty = [];

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
    const url = `https://realstonks.p.rapidapi.com/${name}`
      fetch(url, {
        method: "GET", headers: {
          'X-RapidAPI-Key': '0797411f85mshe8e28b38b23bf20p119c18jsnd1deb8753da6',
          'X-RapidAPI-Host': 'realstonks.p.rapidapi.com'
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //ako ticker-a e veche syshtestvuvasht
        if ( stockListData.find(el => {
          return el.ticker === name
        })
        ) { 
          //tuk updatevame stockListData        
          setStockListData(prev => { 
            const updatedDataForTicker = {
              ticker: name,
              price: data.price,
              change_point: data.change_point, 
              change_percentage: data.change_percentage,
              total_vol: data.total_vol
            }
            //mapping over the prev obj to find the component that needs to be changed
            const updatedData = prev.map(el => {
              if (el.ticker === updatedDataForTicker.ticker) {
                return updatedDataForTicker;
              } else {
                return el;
              }
            })
            return updatedData;  
          })
          setCurrStockTicker(name);
          
        } else {
            ///ne e bila v lista oshte
            setStockListData(prev => ([
              ...prev, {
                ticker: name,
                price: data.price,
                change_point: data.change_point,
                change_percentage: data.change_percentage, 
                total_vol: data.total_vol
              }]
            ))
            setCurrStockTicker(name)
          }
        }) 
        .catch((error) => console.log(error))
  }
  
  function findCurrStockTicker() {
    const currStock = stockListData?.find(list => {
      return list.ticker === currStockTicker;
    }) || stockListData[0].ticker;

    return (currStock?.ticker) || '';
  }
  
  
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    
    const stockName = formJson.stockName;
    fetchStockData(stockName)
    
    ref.current.value = "";
  }

  return (
    <main>
      {stockListData.length > 0 ? 
        <>
          <Navbar />
            <form method="post" onSubmit={handleSubmit}>
              <button> Add </button>
              <input
                name="stockName"
                ref={ref} />
            </form>
          <StockList
            stockListData={stockListData}
            currStockTicker={findCurrStockTicker()}
            setCurrStockTicker={setCurrStockTicker}
            deleteStock={deleteStock}
            fetchStockData={fetchStockData}
          />
          </>
        : 
        <div className = "no-stocks">
          <h1>Add stocks to your watchlist</h1>
          <form method="post" onSubmit={handleSubmit}>
            <button> Add </button>
            <input
                name="stockName"
                ref={ref} 
            />
          </form>
        </div>
    } 
    </main>
  )
}