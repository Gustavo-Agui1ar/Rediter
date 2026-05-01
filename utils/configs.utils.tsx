export const configs = {
  DevelopURL: ["http://10.0.2.2:6969"],
  ProductionURL: ["http://159.112.185.202:6969"],
  timeout: 20000,
  Production: true,
  GoogleClientID:
    "573963521901-0tovmn0v1au6ob5dm2uq7q19gm21o144.apps.googleusercontent.com",
};

export const getBaseURL = () => {
  if (!configs.Production) {
    return configs.DevelopURL[0];
  }

  return configs.ProductionURL[0];
};
