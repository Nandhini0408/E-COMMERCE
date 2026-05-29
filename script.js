const apiURL =
"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true";

const cryptoTable =
document.getElementById("cryptoTable");

const loader =
document.getElementById("loader");

const searchInput =
document.getElementById("searchInput");

const watchlistDiv =
document.getElementById("watchlist");

let cryptoData = [];

let watchlist = JSON.parse(
localStorage.getItem("watchlist")
) || [];

async function fetchCrypto(){

    loader.style.display = "block";

    try{

        const response =
        await fetch(apiURL);

        cryptoData =
        await response.json();

        loader.style.display = "none";

        displayCoins(cryptoData);

    }
    catch(error){

        loader.style.display = "none";

        alert("API Error");
    }
}

function displayCoins(data){

    cryptoTable.innerHTML = "";

    data.forEach((coin,index) => {

        const row =
        document.createElement("tr");

        const changeClass =
        coin.price_change_percentage_24h >= 0
        ? "green"
        : "red";

        row.innerHTML = `

        <td>
            <img src="${coin.image}">
            ${coin.name}
        </td>

        <td>
            $${coin.current_price.toLocaleString()}
        </td>

        <td class="${changeClass}">
            ${coin.price_change_percentage_24h.toFixed(2)}%
        </td>

        <td>
            $${coin.market_cap.toLocaleString()}
        </td>

        <td>
            <canvas id="chart${index}">
            </canvas>
        </td>

        <td>
            <button onclick="addToWatchlist('${coin.name}')">
                ⭐
            </button>
        </td>
        `;

        cryptoTable.appendChild(row);

        createChart(
            `chart${index}`,
            coin.sparkline_in_7d.price
        );
    });
}

function createChart(id,data){

    new Chart(
        document.getElementById(id),
        {
            type:"line",

            data:{
                labels:data.map(()=>""),
                datasets:[{
                    data:data,
                    borderWidth:2,
                    fill:false
                }]
            },

            options:{
                plugins:{
                    legend:{
                        display:false
                    }
                },

                scales:{
                    x:{
                        display:false
                    },
                    y:{
                        display:false
                    }
                }
            }
        }
    );
}

searchInput.addEventListener(
    "input",
    () => {

        const value =
        searchInput.value.toLowerCase();

        const filtered =
        cryptoData.filter(coin =>
            coin.name.toLowerCase()
            .includes(value)
        );

        displayCoins(filtered);
    }
);

document.getElementById("themeBtn")
.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");
    }
);

function addToWatchlist(name){

    if(!watchlist.includes(name)){

        watchlist.push(name);

        localStorage.setItem(
            "watchlist",
            JSON.stringify(watchlist)
        );

        renderWatchlist();
    }
}

function renderWatchlist(){

    watchlistDiv.innerHTML = "";

    watchlist.forEach(coin => {

        const div =
        document.createElement("div");

        div.classList.add("watch-card");

        div.innerHTML = `
            ${coin}
        `;

        watchlistDiv.appendChild(div);
    });
}

renderWatchlist();

fetchCrypto();

setInterval(
    fetchCrypto,
    30000
);