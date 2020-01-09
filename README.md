# Serverless AWS Demo

Template for showcasing serverless framework and aws lambdas and step functions.  

This project creates a series of lambda functions that are registered to a state machine. The state machine can be triggered via Rest and processes a POST body in a sequeunce that can be followed in a function graph then finally returns an object containing hashes.

Demos
- serverless framework
- aws lambda functions
- aws step functions
- serverless multi file project
- serverless cron lamdbas
- serverless rest endpoint lambdas
- serverless using pseudo-parameters plugin
- serverless using aws step functions plugins
- serverless step function choice handling
- serverless step function error handling
- serverless using typescript plugin
- serverless packaging
- TODO serverless stage declaration
- TODO serverless environment variable
- TODO IAM roles
- TODO cnf roles
- TODO lambda layers

## Prerequisites
- [Create an AWS account](https://portal.aws.amazon.com/billing/signup#/)
- [Create a serverless account](https://https://serverless.com/)
- [Install nvm](https://github.com/nvm-sh/nvm)
    - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash`
- Install node version ^12 
    - `nvm install v12.14.1`
- Install serverless via 
    - `npm i -g serverless`

## Running and deploying
Install npm dependencies
- `npm install`

Create a serverless service
- `$ serverless login`
- `$ serverless --org <yourUsername> --app string-transform`
- `$ cd string-transform`
- `$ serverless deploy -v`

To deploy to serverless using stages:
- `serverless deploy --stage dev -v`

## Invoking lambdas and state machines

Replace the URL in the following curl command with your returned endpoint URL, which you can find in the sls deploy output, to hit your URL endpoint. Should look similar to the one below

```
endpoints:  
  POST - https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/manipulate
```

Invoke state machine via curl
- `curl --request POST --url https://<yourResourceUrl>.amazonaws.com/dev/manipulate -d '{"word": "linux"}'`
- should return something like this
`{"executionArn":"arn:aws:states:us-east-1:xxxxxxxxxxx:execution:stringTransformationStateMachine:3d75c5c0-e144-494d-a1af-25d39ce708e3","startDate":1.578603004077E9}`

Invoke lambdas locally
- `serverless invoke local --function <functionName> --data '{"word":"linux"}'`


You can view/edit your lambda functions in the aws console [here](https://console.aws.amazon.com/lambda/)  
You can view your state machines in the aws console [here](https://console.aws.amazon.com/states/)

If everything went well you should have the following state machine.
<!-- ![Alt text](stepfunctions_graph.svg) -->
<img src="stepfunctions_graph.svg" width="50%">

Explanation:
1. Lambda to trigger step function is invoked via REST endpoint.
2. RequestForStringManipulation lambda is triggered and sends the POST body to next lambda via callback.
3. HasNumerical lambda is called with POST body and determines if it should go to the next step or fail if there is a numerical charater present.
4. Determine next step
    - On failure: FailedState lambda is triggered then we End state
    - On success: ReverseString lambda is triggered and reverses the passed value
5. CapitalizeString lambda is triggered and capitalizes the passed value.
6. QuoteString lambda is triggered and quotes the passed value.
7. Call to external API for generating hashes lambda is triggered and handles error if any otherwise passed value is hashed.
8. End State Machine and return 200 with hashed payload.


## Remove project from serverless and aws

To remove a serverless project (lambdas and step functions) from aws issue the following command
`serverless remove`  

To remove the app from the serverless dashboard. You will have to do it follow the instruction in the serverless web ui.
- Navigate to the app dashboard 
- Select app and navigate to app settings > general > remove app