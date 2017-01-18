import Request from 'request';

export default function verifyCaptcha(captchaResponse, secret, ip) {

  return new Promise(function (resolve, reject){

    function handleResponse(error, response, body) {
      if (error) {
        reject(error);
      }

      if (response.statusCode !== 200) {
        reject(new Error('Error validating captcha: ' + response.statusCode));
      }

      var data = JSON.parse(body);

      if (data.success) {
        resolve(true)
      } else {
        reject(new Error("Error from reCaptcha: " + JSON.stringify(data)));
      }
    }
    const config = {
      form: {
        response: captchaResponse,
        secret: secret,
        remoteip: ip
      }
    };
    Request.post('https://www.google.com/recaptcha/api/siteverify', config, handleResponse);
  });

}
