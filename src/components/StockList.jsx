import React from "react"

export default function StockList({stockListData}) {
    const stockElements = stockListData.map((el, index) => {
        <div key = {index} >
            <h3>{el.ticker}</h3>
        </div>
    });
   // console.log(stockElements)
    return (
        <div>
            {stockElements}
        </div>
    )
}