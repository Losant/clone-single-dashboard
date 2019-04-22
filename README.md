# Clone Single Dashbaord

This repo provides come boilerplate code to transfer a single owner dashboard.

1. Clone Repo

2. Run `yarn install`

3. Open `index.js` and configure the following variables:

```
const userAuthParams = {
  credentials: {
    "email": "LOSANT EMAIL",
    "password": "PASSWORD"
  }
};

var sourceDashboardParams = {
  dashboardId: "DASHBOARDID"
};

var targetDashboardParams = {
  applicationId: "APPLICATIONID"
};
```

This code will transfer the dashboard at `DASHBOARDID` to `APPLICATIONID`

4. Run `node index.js`