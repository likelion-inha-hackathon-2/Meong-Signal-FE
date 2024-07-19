const Dotenv = require("dotenv-webpack");

module.exports = {
  resolve: {
    // 나중에 필요시 설정 추가
  },
  plugins: [
    new Dotenv(), // .env 파일에서 환경 변수 로드
  ],
  module: {
    rules: [
      {
        test: /\.css$/i, // 모든 .css 파일에 대해
        use: ["style-loader", "css-loader"], // style-loader와 css-loader를 사용
      },
    ],
  },
};
