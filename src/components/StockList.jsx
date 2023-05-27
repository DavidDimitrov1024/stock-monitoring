import { React, useEffect, useSate } from "react"

export default function StockList(props) {
    const MINUTE_MS = 10000;
    useEffect(() => {
        const interval = setInterval(() => {
            props.fetchStockData(props.currStockTicker)
        }, MINUTE_MS);
        return () => clearInterval(interval);
    }, [])

    const stockElements = props.stockListData.map((el, index) => (
        <div key = {index} >
            <div 
                className = "stock-box"
                onClick = {() => {
                    return (
                        props.setCurrStockTicker(el.ticker)
                    ) 
                }}    
            >
                <h4 className = "text-snipets">{el.ticker}</h4>
                <h4 className = {`direction-${
                    el.change_point > 0 ? "up" : "down"
                }`}>
                    {el.price}
                </h4>
                <h4 className = {`direction-${
                    el.change_point > 0 ? "up" : "down"
                }`}>
                     {el.change_point}
                </h4>
                <h4 className = {`direction-${
                    el.change_point > 0 ? "up" : "down"
                }`}>
                    {el.change_percentage}
                </h4>
                <button 
                    className="delete-btn"
                    onClick={(event) => props.deleteStock(event, el.ticker)}
                >
                    <i className="gg-trash"></i>
                </button>
            </div>
        </div>
    ));

    return (
        <div>
            {stockElements}
        </div>
    )
}