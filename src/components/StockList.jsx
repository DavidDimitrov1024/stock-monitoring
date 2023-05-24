import React from "react"

export default function StockList(props) {
    const stockElements = props.stockListData.map((el, index) => {
        <div key = {index}>
            <h3>{el}</h3>
        </div>
    });
    return (
        <div>
            {stockElements}
        </div>
    )
}