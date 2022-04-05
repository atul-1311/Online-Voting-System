let lineChart = document.getElementById('result-line-chart').getContext('2d');
let barChart = document.getElementById('result-bar-chart').getContext('2d');
const chartBtn = document.getElementById('chart-btn')
const lChart = document.getElementById('result-line-chart')
const bChart = document.getElementById('result-bar-chart')
const total_voters = document.getElementById('total_num_voters')
const total_num_voters_result = document.getElementById('total_num_voters_result')

// voters count
let hiddenVotersCount = document.getElementById('hiddenVotersCount').value
let voternum = JSON.parse(hiddenVotersCount)
console.log(voternum);
if(voternum<10){
    total_voters.innerHTML = '0'+ voternum
}else{
    total_voters.innerHTML = voternum
}

// Chart
let hiddenResult = document.getElementById('hiddenResult').value
let result = JSON.parse(hiddenResult)
var names = [];
result.forEach(candidate => names.push(candidate.name));

var counts = [];
result.forEach(candidate => counts.push(candidate.count))




//Line Chart

let myChart = new Chart(lineChart, {
    type:'line',
    data:{
        labels:names,
        datasets:[{
            data:counts,
            backgroundColor: '#009a9a',
            borderColor:'#808080',
            borderWidth : 1.5,
            pointBorderColor: '#00c9c9',
            pointRadius : 7,
            pointHoverBackgroundColor: '#00c9c9',
            pointHoverRadius: 9,
            fontColor : '#006767'
        }]
    },
    options:{
        responsive:false,
        plugins:{
            legend:{
                display:false
            },
            title:{
                display : true,
                text: 'Live Voting Result',
                font:{
                    size:20
                }
            },
        },
        scales:{
            x:{
                grid: {
                    borderColor: '#006767',
                    borderWidth:2,
                    color:'#303030',
                    
                },
                title:{
                    display:true,
                    text:'Candidates',
                    color:'#808080',
                    font:{
                        size:15
                    }
                }
            },
            y:{
                grid: {
                    borderColor: '#006767',
                    borderWidth:2,
                    color:'#303030'
                },
                title:{
                    display:true,
                    text:'Votes',
                    color:'#808080',
                    font:{
                        size:15
                    }
                }
            },
        }
    }
})

let newChart = new Chart(barChart, {
    type:'bar',
    data:{
        labels:names,
        datasets:[{
            data:counts,
            backgroundColor: '#006767',
            borderColor:'#808080',
            borderWidth : 1.5,
            fontColor : '#006767'
        }]
    },
    options:{
        responsive:false,
        plugins:{
            legend:{
                display:false
            },
            title:{
                display : true,
                text: 'Live Voting Result',
                font:{
                    size:20
                }
            },
        },
        scales:{
            x:{
                grid: {
                    borderColor: '#006767',
                    borderWidth:2,
                    color:'#303030',
                    
                },
                title:{
                    display:true,
                    text:'Candidates',
                    color:'#808080',
                    font:{
                        size:15
                    }
                }
            },
            y:{
                grid: {
                    borderColor: '#006767',
                    borderWidth:2,
                    color:'#303030'
                },
                title:{
                    display:true,
                    text:'Votes',
                    color:'#808080',
                    font:{
                        size:15
                    }
                }
            },
        }
    }
})

chartBtn.addEventListener('click', ()=>{
    lChart.classList.toggle('line-slide');
    bChart.classList.toggle('bar-slide')
    if(chartBtn.innerHTML == "Line Chart"){
        chartBtn.innerHTML = "Bar Chart"
    }else{
        chartBtn.innerHTML = "Line Chart"
    }
})

