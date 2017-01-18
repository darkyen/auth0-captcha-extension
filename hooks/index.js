import express          from 'express';
import Request          from 'request';
import auth0            from 'auth0@2.1.0';
import jwt              from 'jsonwebtoken@7.1.9';
import URLJoin          from 'url-join';
import createRule       from '../rules/check-captcha.js';
import addAuth0ManagementClient from '../lib/addAuth0';

function findRule(rules, name){
  return rules.filter(function(rule){
    return rule.name === name;
  })[0];
}

const ManagementClient = auth0.ManagementClient;
const hooks            = express.Router();

/*
 * Accepts a string path and returns an Express.Middleware
 * which verifies if the audience for jwt included that path
 * along with the issuer etc.
 */
function createRuleValidator (path) {
  return function (req, res, next) {

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const token = req.headers.authorization.split(' ')[1];
      return jwt.verify(token, req.webtaskContext.data.EXTENSION_SECRET, {
        audience: URLJoin(req.webtaskContext.data.WT_URL, path),
        issuer: 'https://' + req.webtaskContext.data.AUTH0_DOMAIN
      }, function (err, decoded){
        if (err) {
          return res.sendStatus(401);
        }
        return next();
      });
    }

    return res.sendStatus(401);
  }
}

// Validate JWT for on-install
hooks.use('/on-install', createRuleValidator('/.extensions/on-install'));
hooks.use('/on-uninstall', createRuleValidator('/.extensions/on-uninstall'));
hooks.use('/on-update', createRuleValidator('/.extensions/on-update'));

// Getting Auth0 APIV2 access_token
hooks.use(addAuth0ManagementClient);

/* To check everything */
hooks.get('/checkall', function (a,b) {
  b.status(200).end('Ok');
});

// This endpoint would be called by webtask-gallery
hooks.post('/on-install', function (req, res) {
  const ctx = req.webtaskContext.data;

  req.auth0.rules.create({
    name: 'captcha-rule-PLEASE-DO-NOT-RENAME',
    script: createRule({
      EXTENSION_SECRET: ctx.EXTENSION_SECRET,
      CAPTCHA_URL: ctx.WT_URL
    }),
    order: 2,
    enabled: true,
    stage: "login_success"
  })
  .then(function () {
    res.sendStatus(204);
  })
  .catch(function (e) {
    res.sendStatus(500);
  });
});

// This endpoint would be called by webtask-gallery
hooks.put('/on-update', function (req, res) {
  res.sendStatus(204);
});

// This endpoint would be called by webtask-gallery
hooks.delete('/on-uninstall', function (req, res) {
  req.auth0
    .rules.getAll()
    .then(function (rules) {
      var rule = findRule(rules, 'captcha-rule-PLEASE-DO-NOT-RENAME');

      if (rule) {
        req.auth0
          .rules.delete({ id: rule.id })
          .then(function () {
            res.sendStatus(204);
          })
          .catch(function () {
            res.sendStatus(500);
          });
      }
    })
    .catch(function () {
      res.sendStatus(500);
    });
});


export default hooks;
