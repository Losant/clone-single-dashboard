const omnibelt = require('omnibelt')
const api = require('losant-rest')
const { pick, keys } = omnibelt
const LosantApiClient = api.createClient()
const dashboardPostSchema = require('losant-rest/lib/schemas/dashboardPost.json')

const userAuthParams = {
  credentials: {
    "email": "LOSANT EMAIL",
    "password": "PASSWORD"
  }
}

var sourceDashboardParams = {
  dashboardId: "DASHBOARDID"
}

var targetDashboardParams = {
  applicationId: "APPLICATIONID"
}

const buildCloneDashboard = data => {
  // only pull properties from the post schema
  const { applicationId } = targetDashboardParams
  const dashboard = {
    ...pick(
      keys(dashboardPostSchema.properties), // only pull properties from the post schema
      data
    ),
    applicationId: applicationId,
    name: `${data.name} (Cloned)`, // add '(Cloned)' to the name
    reportConfigs: [], // blank out the report configuration
    public: false // set to private by default
  }
  // add an orgId if the dashboard is org-owned
  if (!applicationId && ownerType === 'organization') {
    dashboard.orgId = ownerId
  }
  return dashboard
}

const cloneDashboard = async (
  userAuthParams,
  targetDashboardParams,
  sourceDashboardParams
) => {
  // Auth User
  const authResponse = await LosantApiClient.auth.authenticateUser(
    userAuthParams
  )

  // Set Token
  LosantApiClient.setOption('accessToken', authResponse.token)

  // Get Source Dashboard
  const getDashboardResponse = await LosantApiClient.dashboard.get(
    sourceDashboardParams
  )

  // Get new Dashboard Data
  const newDashboardData = buildCloneDashboard(getDashboardResponse)

  const newDashboard = await LosantApiClient.dashboards.post({
    dashboard: newDashboardData
  })

  console.log(
    `Cloned to: https://app.losant.com/applications/${targetDashboardParams.applicationId}/dashboards`
  )
  console.log(
    `The cloned dashboard: https://app.losant.com/dashboards/${newDashboard.id}`
  )
}


cloneDashboard(userAuthParams, targetDashboardParams, sourceDashboardParams)
