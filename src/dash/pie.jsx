import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'


const PieChart = ({ datas }) => {
    return <Pie data={datas} />
}
export default PieChart;