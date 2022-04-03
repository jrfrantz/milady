const { ethers } = require('ethers');
const axios = require('axios')

let feelessOrders = [];

async function main() {
    const base = "https://api.reservoir.tools/orders/all/v1?contract=0x5af0d9827e0c53e4799bb226655a1de152a425a5&limit=500"
    var continuation = null;
    let i = 0;
    do {
        const url = !!continuation ? `${base}&continuation=${continuation}` : base
        const res = await axios.get(url)
        let  { orders, continuation: newContinuation } = res.data;
        processOrders(orders);
        ++i;
        continuation = newContinuation;
    } while (continuation)
    console.log("Done, %s iterations and %s in total", i, feelessOrders.length);
}

function isNotableOrder(order) {
    return order.feeBps === 500 
        && order.maker !== "0x95db775fce905ae78ebfda1845470121208cea39" // me
    //return order.feeBps === 500;
}

function processOrders(orders) {
    orders.map(order => {
        if (isNotableOrder(order)) {
            console.log(order);
            feelessOrders.push(order);
        }
    })
}

main()
.then(() => console.log("Done"))
.catch(console.error);
