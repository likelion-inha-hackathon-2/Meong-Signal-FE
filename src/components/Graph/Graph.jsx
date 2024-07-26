import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Graph = ({ recentWalks }) => {
  let cumulativeDistance = 0;
  const labels = recentWalks.map((walk) =>
    new Date(walk.date).toLocaleDateString(),
  );
  const dataPoints = recentWalks.map((walk) => {
    cumulativeDistance += parseFloat(walk.distance);
    return cumulativeDistance;
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: "누적 산책 거리 (km)",
        data: dataPoints,
        fill: false,
        backgroundColor: "rgb(255, 157, 157)",
        borderColor: "#DF6666",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "날짜",
        },
      },
      y: {
        title: {
          display: true,
          text: "거리 (km)",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

Graph.propTypes = {
  recentWalks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      distance: PropTypes.string.isRequired,
      kilocalories: PropTypes.string.isRequired,
      time: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      user_id: PropTypes.number.isRequired,
      owner_id: PropTypes.number.isRequired,
      dog_id: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default Graph;
