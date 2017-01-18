import tools from 'auth0-extension-tools';

export default function addAuth0ManagementClient(req, res, next) {
  const ctx = req.webtaskContext.data;
  const domain = ctx.AUTH0_DOMAIN;
  const clientSecret = ctx.AUTH0_CLIENT_SECRET;
  const clientId = ctx.AUTH0_CLIENT_ID;
  const opts = {domain, clientId, clientSecret};
  tools.managementApi.getClient(opts).then(function (client) {
    req.auth0 = client;
    next();
  });
}
