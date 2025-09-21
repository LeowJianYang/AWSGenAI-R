// aws-exports.js
const awsmobile = {
  Auth: {
    region: "ap-southeast-1", // 你的 Cognito 区域
    userPoolId: "ap-southeast-1_XXXXXXX", // 你的 Cognito User Pool ID
    userPoolWebClientId: "XXXXXXXXXXXXXXXXXXXX", // 你的 App Client ID
  }
};

export default awsmobile;
