import * as https from 'https';
import * as querystring from 'querystring';

/**
 * Module containing functions for aws lambda
 * @author github.com/randyyaj
 * @version 2019.01
 */

/**
 * Pure nodejs request helper function for GET/POST request.
 * NOTE: Using a library like request or axios would be simpler and easier to understand.
 * @param options Node http options 
 * @see https://nodejs.org/api/http.html#http_http_request_options_callback
 * @return Promise with resolved data.
 */
function httprequest(options: https.RequestOptions, postData: any = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res: any) => {   
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      
      //res.setEncoding('utf8');
      let body = [] as Uint8Array[];
      
      res.on('data', (chunk: Uint8Array) => {
        body.push(chunk);
      });

      res.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch(e) {
          reject(e);
        }
        resolve(body);
      });
    });
    
    req.on('error', (e) => {
      reject(e.message);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

/**
 * Function to POST data to an external API and recieve a response back
 * @param event The passed in event containing relevant http metadata
 * @see https://helloacm.com/tools/hash/
 * @return object response
 */
export async function encrypt(event: any) {
  let postData = querystring.stringify({
    s: event.word
  });

  const options = {
    host: 'helloacm.com',
    path: '/api/hash/?cached',
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      //'Content-Type': 'application/json',
      //'Content-Length': postData.length
    }
  };

  return httprequest(options, postData).then((data) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };
    return response;
  });
}

/**
 * Demo function for scheduled cron lambdas. Simply returns success.
 * @see https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
 * @see serverless.yml#minutecron
 * @return string
 */
export async function minutecron() {
  return 'success';
}

/**
 * Lambda Function for invoking Step 1 of our AWS Step State Machine. This lambda is triggered via http POST.
 * Local Invocation: serverless invoke local --function manipulate --data '{"word":"linux"}'
 * @see serverless.yml#stepfunctions
 * @param event Contains input data from caller
 * @param context 
 * @param callback Consume newly modified string and pass it to next lambda or caller
 * @return object {statusCode, body}
 */
export async function manipulate(event: any, context: any, callback: any) {
  // const params = event.queryStringParameters; //multi not support https://theburningmonk.com/2019/05/icmi-five
  // const paths = event.pathParameters;

  if (event) {
    callback(null, event);
  } else {
    return {
      statusCode: 304,
      body: 'No modification'
    };
  }
}

/**
 * Lambda function that reverses a string.
 * Local Invocation: serverless invoke local --function reverse --data '{"word": "linux"}'
 * @param event Contains input data from caller
 * @param context
 * @param callback Consume newly modified string and pass it to next lambda or caller
 * @return object {statusCode, body}
 */
export async function reverse(event: any, context: any, callback: any) {
  if (event.word) {
    let reversed = event.word.split('').reverse().join('');
    callback(null, {word: reversed});
  } else {
    const response = {
      statusCode: 304,
      body: 'No modification'
    };
    callback(null, response);
  }
}

/**
 * Lambda function that capitalizes a string
 * Local Invocation: serverless invoke local --function capitalize --data '{"word": "linux"}' 
 * @param event Contains input data from caller
 * @param context 
 * @param callback Consume newly modified string and pass it to next lambda or caller
 * @return object {statusCode, body}
 */
export async function capitalize(event: any, context: any, callback: any) {
  if (event.word) {
    let uppercased = event.word.toUpperCase();
    callback(null, {word: uppercased});
  } else {
    const response = {
      statusCode: 304,
      body: 'No modification'
    };
    callback(null, response);
  }
}

/**
 * Lambda function that quotes a string
 * Local Invocation: serverless invoke local --function quote --data '{"word": "linux"}'
 * @param event Contains input data from caller
 * @param context 
 * @param callback Consume newly modified string and pass it to next lambda or caller
 * @return object {statusCode, body}
 */
export async function quote(event: any, context: any, callback: any) {
  if (event.word) {
    let quoted = `"${event.word}"`;
    callback(null, {word: quoted});
  } else {
    const response = {
      statusCode: 304,
      body: 'No modification'
    };
    callback(null, response);
  }
}

/**
 * Lambda function checks if string is a palindrome
 * Local Invocation: serverless invoke local --function isPalindrome --data '{"word": "racecar"}'
 * @param event Contains input data from caller
 * @param context 
 * @param callback Consume newly modified string and pass it to next lambda or caller
 * @return object {statusCode, body}
 */
export async function isPalindrome(event: any, context: any, callback: any) {
  let isPalindrome = false;

  if (event.word) {
    if (event.word.split("").reverse().join("") === event.word) {
      isPalindrome = true;
    }

    callback(null, {word: event.word, isPalindrome: isPalindrome});
  } else {
    const response = {
      statusCode: 304,
      body: 'No modification'
    };
    callback(null, response);
  }
}

/**
 * Lambda function checks if string contains numbers.
 * Local Invocation: serverless invoke local --function isPalindrome --data '{"word": "racecar"}' 
 * @param event Contains input data from caller
 * @param context 
 * @param callback Consume newly modified string and pass it to next lambda or caller
 * @return object {statusCode, body}
 */
export async function hasNumerical(event: any, context: any, callback: any) {
  if (event.word) {
    let hasNumerical = /\d/.test(event.word);
    callback(null, {word: event.word, hasNumerical: hasNumerical});
  } else {
    const response = {
      statusCode: 304,
      body: 'No modification'
    };
    callback(null, response);
  }
}