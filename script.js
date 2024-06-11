function updateChart(data, device) {
    const ctx = document.getElementById('powerChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Assuming time is in hours and power in Watts
    const xMin = Math.min(...data.time.map(t => parseInt(t.split(':')[0]))); // Example: start from the minimum hour
    const xMax = Math.max(...data.time.map(t => parseInt(t.split(':')[10]))); // Example: end at the maximum hour
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
