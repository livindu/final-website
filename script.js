function logout() {
    window.location.href = 'index.html';
}

document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username or password');
    }
});

function fetchChartData(device) {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data, device);
            updateChart(parsedData, device);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function parseCSV(data, device) {
    const rows = data.split('\n');
    const headers = rows[0].split(',');
    const time = [];
    const power = [];
    
    const timeIndex = headers.indexOf('time');
    const devicePowerIndex = headers.indexOf(device + '_power');

    rows.slice(1).forEach(row => {
        const cols = row.split(',');
        if (cols.length > timeIndex && cols.length > devicePowerIndex) {
            time.push(cols[timeIndex]);
            power.push(parseFloat(cols[devicePowerIndex]));
        }
    });

    return { time, power };
}

function updateChart(data, device) {
    const ctx = document.getElementById('powerChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Assuming time is in hours and power in Watts
    const xMin = Math.min(...data.time.map(t => parseInt(t.split(':')[0]))); // Example: start from the minimum hour
    const xMax = Math.max(...data.time.map(t => parseInt(t.split(':')[0]))); // Example: end at the maximum hour
    const yMin = 0; // You can set this to the minimum expected power consumption
    const yMax = Math.max(...data.power) * 1.2; // 20% higher than the maximum power for some margin

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.time,
            datasets: [{
                label: `${device.charAt(0).toUpperCase() + device.slice(1)} Power Consumption`,
                data: data.power,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    },
                    min: xMin,
                    max: xMax
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power (W)'
                    },
                    min: yMin,
                    max: yMax
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


function showDeviceChart(device) {
    document.getElementById('deviceIframe').style.display = 'none';
    document.getElementById('powerChart').style.display = 'block';
    document.getElementById('chartTitle').style.display = 'block';
    document.getElementById('chartTitle').innerText = `${device.charAt(0).toUpperCase() + device.slice(1)} Power Consumption`;
    fetchChartData(device);
}

function showMainChart() {
    showDeviceChart('main');
}

document.getElementById('mainBtn')?.addEventListener('click', showMainChart);

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mainBtn')) {
        showMainChart();
    }
});
