export default function createRule(config) {
  let rule = (function (user, context, callback) {
    // Based on work done by Nicolas Sebana
    const jwt = escapeRequire('jsonwebtoken@7.1.9');
    const audience = `https://${auth0.domain}/captcha/webtask`;
    const issuer = `https://${auth0.domain}/captcha/rule`;

    const config = CONFIG;
    const secret = config.EXTENSION_SECRET;
    const redirectUrl = config.CAPTCHA_URL;

    if (context.protocol === "redirect-callback") {

      // handle signed response
      function postVerify(err, decoded) {
        if (err) {
          return callback(new UnauthorizedError("Error validating token from wt: " + err));
        } else if (decoded.sub !== user.user_id) {
          return callback(new UnauthorizedError("Token does not match the current user."));
        } else if (!decoded.captchaOk) {
          return callback(new UnauthorizedError("Captcha validation was not successful.\n" +
            decoded.errorMessage || ""));
        } else {
          // Captcha ok, go ahead with authentication
          return callback(null, user, context);
        }
      };

      return jwt.verify(
        context.request.query.token,
        secret,
        {
          audience: issuer,
          issuer: audience
        },
        postVerify
      );
    }

    const payload = {
      sub: user.user_id,
      clientName: context.clientName,
    };

    const options = {
      expiresIn: "5m",
      audience: audience,
      issuer: issuer
    };

    return jwt.sign(payload, secret, options, function(err, token) {
      if(err){
        // You will receive this and its the apps responsibility to display the user.
        return callback(new Error('Cannot run Captcha'));
      }

      const separator = redirectUrl.indexOf('?') !== -1 ? "&" : "?";

      // Issue the redirect command
      context.redirect = {
        url: redirectUrl + separator + "token=" + token + "&webtask_no_cache=1"
      };
      callback(null, user, context);
    });

  }).toString();

  const re = new RegExp('CONFIG', 'g');
  const rr = new RegExp('escapeRequire', 'g');

  rule = rule.replace(re, 'JSON.parse(\'' + JSON.stringify(config) + '\')');
  rule = rule.replace(rr, 'require');
  return rule;
}
