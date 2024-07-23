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
  const data = {
    labels: recentWalks.map((walk) => new Date(walk.date).toLocaleDateString()),
    datasets: [
      {
        label: "산책 거리 (km)",
        data: recentWalks.map((walk) => parseFloat(walk.distance)),
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
      meong: PropTypes.number.isRequired,
      time: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      user_id: PropTypes.number.isRequired,
      owner_id: PropTypes.number.isRequired,
      dog_id: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default Graph;
