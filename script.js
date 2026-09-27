let weatherCities = []

let currentCityLatAndLOn = {}
let currentCity5Days = []
let selectedOption = 0
let all5daysforcast = []
let highAndLowTemp = []
let fiveDayIconForcast = []
const searchInput = document.getElementById("search-input");
const searchIcon = document.querySelector(".search-icon");
const dialogDiv = document.querySelector(".dialog");
const multiOptions = document.querySelector(".multi-options");
// f5157c578300b6e6122180b23b915d60

 searchIcon.addEventListener("click",async()=>{
   await initialCityFetch()
   
   if(weatherCities.length === 1){
    selectedOption = 0
       await initialLatAndLonFetch()
       mainOnecityOutput(); 
    await mainTwocityOutput();
}
   
   

   else{
   multiOptions.innerHTML = `
        <option value="" disabled selected>Select which state</option>`
    ;
        weatherCities.forEach((weatherCity,index)=>{
       multiOptions.innerHTML += `
      <option value = "${index}">${weatherCity.name},${weatherCity.state},${weatherCity.country} </option> `
     })
     console.log(weatherCities)
       dialogDiv.showModal()

   }
   

  
})

  multiOptions.addEventListener("change",async()=>{
       dialogDiv.close()
       selectedOption = Number(multiOptions.value)
      await initialLatAndLonFetch()
mainOnecityOutput();
await mainTwocityOutput();
      })

const initialCityFetch = async () =>{
    try{
         const res = await fetch (`https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value},NG&limit=${5}&appid=f5157c578300b6e6122180b23b915d60`)

    const initialSearchOutput = await res.json();
    
    weatherCities = initialSearchOutput
    }
    catch(err){
        console.error(err);
        
    }
   
}


const initialLatAndLonFetch = async () =>{
    try{
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${weatherCities[selectedOption].lat}&lon=${weatherCities[selectedOption].lon}&appid=f5157c578300b6e6122180b23b915d60`)

    const latAndLonOUtput = await res.json()
    currentCityLatAndLOn = latAndLonOUtput
    }
  catch(err){
    console.error(err);
    
  }
    
}

const initial5DayFetch = async () =>{
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${weatherCities[selectedOption].lat}&lon=${weatherCities[selectedOption].lon}&appid=f5157c578300b6e6122180b23b915d60`)
  const latAndLonOUtput = await res.json()
  currentCity5Days = latAndLonOUtput
  } catch (err) {
    console.error(err);
    throw err;
    
    
  }

  
}
let fiveDays = []
const dataProcessing = async()=>{

 try {
     all5daysforcast = []
  highAndLowTemp = []
  fiveDayIconForcast = []
  fiveDays = []

 
  await initial5DayFetch ();

   const dates = new Set();
    currentCity5Days.list.forEach((item)=>{
 let eachdate = item.dt_txt.split(" ")[0]
  
     dates.add(eachdate);            
})

  const  datesArray = [...dates]
    datesArray.forEach((date,index) =>{
      if(index >0){
   const all5dayforcast =  currentCity5Days.list.filter(item=> item.dt_txt.split(" ")[0] === date)    
        all5daysforcast.push(all5dayforcast)
      
        

  const temperature = all5dayforcast.map(item=> item.main.temp)
  const cloudIcon = all5dayforcast.map(item=> item.
weather[0].icon)
const weatherDescription = all5dayforcast.map(
  item => item.weather[0].description
)

const noonIndex = all5dayforcast.findIndex(item => item.dt_txt.includes("12:00:00"))
const nightIndex = all5dayforcast.findIndex(item => item.dt_txt.includes("03:00:00"))

const fiveDayIconResult = {
   noon: cloudIcon[noonIndex],
   night: cloudIcon[nightIndex],
   noonDescription: weatherDescription[noonIndex],
   nightDescription: weatherDescription[nightIndex]

}
fiveDayIconForcast.push(fiveDayIconResult)


  
        const highestTemperature = Math.round(Math.max(...temperature) - 273.15)
const lowestTemperature = Math.round( Math.min(...temperature) - 273.15)
    let result = {
          highestTemperature,
          lowestTemperature
        }
      highAndLowTemp.push(result)
      }
      }
                       
   ) 


datesArray.forEach((item,index)=>{
    if(index> 0){
 let day = new Date(item).toLocaleDateString("en-us", { weekday: "short" })
 let dayDate =  new Date(item).toLocaleDateString("en-us", {  month: "short" , day: "numeric"}) 

 const fiveDaysResult = {
    day,
    dayDate
 }
 fiveDays.push(fiveDaysResult)
    }

    
})
 

 } catch (err) {
    console.error(err);
    throw err;
    
 } 

  
}


const currentDate = new Date();
const todayDate = currentDate.toLocaleDateString("en-us",{
  weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric"
})

const mainOne = document.querySelector(".main-one");
const mainTwo = document.querySelector(".main-two");
const mainOnecityOutput = () =>{
   mainOne.innerHTML = `
            <div class="main-city-display">
                <p class="city">${currentCityLatAndLOn.name}</p>
                <p class="date-city">${todayDate}</p>
                <div class="logo-temperature">
                    <div class="weather-logo"><img src="https://openweathermap.org/img/wn/${currentCityLatAndLOn.weather[0].icon}@2x.png" alt=""></div>
                    <div>
                        <h1 class="city-degree">${Math.round(currentCityLatAndLOn.main.temp - 273.15)}°C</h1>
                        <p>${currentCityLatAndLOn.weather[0].description}</p>
                    </div>
                </div>
            </div>
            <div class="weather-conditions">
                <div class="weather-condition">
                    <span class="material-symbols-outlined">
                        device_thermostat
                    </span>
                    <div>
                        <p>Feels like</p>
                        <p class="degree-confirm">${currentCityLatAndLOn['main']['feels_like']}</p>
                    </div>
                </div>
                <div class="weather-condition">
                    <span class="material-symbols-outlined">
                    humidity_low
                    </span>
                    <div>
                        <p>Humidity</p>
                        <p class="humidity-confirm">${currentCityLatAndLOn.main.humidity}</p>
                    </div>
                </div>
                <div class="weather-condition">
                    <span class="material-symbols-outlined">
                    air
                    </span>
                    <div>
                        <p>Wind</p>
                        <p class="wind-confirm">${Math.floor(currentCityLatAndLOn.wind.speed * 3.6)} km/h</p>
                    </div>
                </div>
                <div class="weather-condition">
                    <span class="material-symbols-outlined">
                    location_on
                    </span>
                    <div>
                        <p>location</p>
                        <p class="degree-confirm">${currentCityLatAndLOn.name}, ${currentCityLatAndLOn.sys.country}</p>
                    </div>
                </div>
            </div>`
        
}


const mainTwocityOutput = async() =>{
  
await dataProcessing()
let timeCheckResult = []
const hoursTime = new Date().getHours()
fiveDayIconForcast.forEach((icon,index)=>{

   const  timeCheckIcon =  hoursTime > 5 && hoursTime < 19 ? icon.noon : icon.night
   const timeCheckDescription = hoursTime > 5 && hoursTime < 19 ? icon.noonDescription : icon.nightDescription

    const result = {
        timeCheckIcon,
        timeCheckDescription
     }
     timeCheckResult.push(result)
})


console.log(timeCheckResult);
console.log(highAndLowTemp);

console.log(fiveDayIconForcast);

console.log(fiveDays);


  mainTwo.innerHTML =   `   
            <div class="main-two-box">
                <h1>5-Day Forecast</h1>
                <div class="main-two-flex">
                    <div class="day">
                       <p><strong>${fiveDays[0].day}</strong> <br>${fiveDays[0].dayDate}</p>
                        <div class="upcoming-img"><img src="https://openweathermap.org/img/wn/${timeCheckResult[0].timeCheckIcon}@2x.png" alt=""></div>
                        <p>${timeCheckResult[0].timeCheckDescription}</p>
                        <p class="day-one-degree"><strong class="bold">${highAndLowTemp[0].highestTemperature}°C</strong>/${highAndLowTemp[0].lowestTemperature}°C</p>
                    </div>
                    <div class="day">
                        <p><strong>${fiveDays[1].day}</strong> <br>${fiveDays[1].dayDate}</p>
                       <div class="upcoming-img"><img src="https://openweathermap.org/img/wn/${timeCheckResult[1].timeCheckIcon}@2x.png" alt=""></div>
                        <p>${timeCheckResult[1].timeCheckDescription}</p>
                        <p class="day-two-degree"><strong class="bold">${highAndLowTemp[1].highestTemperature}°C</strong>/${highAndLowTemp[1].lowestTemperature}°C</p>
                    </div>
                    <div  class="day">
                        <p><strong>${fiveDays[2].day}</strong> <br>${fiveDays[2].dayDate}</p>
                      <div class="upcoming-img"><img src="https://openweathermap.org/img/wn/${timeCheckResult[2].timeCheckIcon}@2x.png" alt=""></div>
                        <p>${timeCheckResult[2].timeCheckDescription}</p>
                        <p class="day-three-degree"><strong class="bold">${highAndLowTemp[2].highestTemperature}°C</strong>/${highAndLowTemp[2].lowestTemperature}°C</p>
                    </div>
                      <div  class="day">
                       <p><strong>${fiveDays[3].day}</strong> <br>${fiveDays[3].dayDate}</p>
                       <div class="upcoming-img"><img src="https://openweathermap.org/img/wn/${timeCheckResult[3].timeCheckIcon}@2x.png" alt=""></div>
                        <p>${timeCheckResult[3].timeCheckDescription}</p>
                        <p class="day-four-degree"><strong class="bold">${highAndLowTemp[3].highestTemperature}°C</strong>/${highAndLowTemp[3].lowestTemperature}°C</p>
                    </div>
                    <div  class="day">
                       <p><strong>${fiveDays[4].day}</strong> <br>${fiveDays[4].dayDate}</p>
                       <div class="upcoming-img"><img src="https://openweathermap.org/img/wn/${timeCheckResult[4].timeCheckIcon}@2x.png" alt=""></div>
                        <p>${timeCheckResult[4].timeCheckDescription}</p>
                        <p class="day-five-degree"><strong class="bold">${highAndLowTemp[4].highestTemperature}°C</strong>/${highAndLowTemp[4].lowestTemperature}°C</p>
                    </div>
                </div>
                <div >
                <p class="footer">
                <span class="material-symbols-outlined">
                error
                </span>
                Search for a city to get the weather details
                </p>
                </div>
     
            </div>
  `                 
}



