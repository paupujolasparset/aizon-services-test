# Aizon test

## Setup

We need nodeJs installed. Clone the repository and run  `npm install -g serverless` to install serverless globally and run `npm install` to install dependencies.

We also need to inform our AWS credentials, run in terminal:

<em>export AWS_ACCESS_KEY_ID=\<your-key-here></em>

<em>export AWS_SECRET_ACCESS_KEY=\<your-secret-key-here></em>

For more details please visit [https://www.serverless.com/framework/docs/providers/aws/guide/credentials/](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)


## Application structure

The application uses `Cognito` for user management and authorization, `Lambda` functions and `DynamoDb` for storing the data.

I will treat solutions, screens and widgets as the same thing: a <b>service</b> and store them all in one unique table

### Table structure

The table structure i've decided to use is the following:
- PK (Partition Key): username
- SK (Sorting Key): The unique uuid of the service. If it's a child service the uuid contains the parent uuid, this way I do not need an extra column indicating the level of the service. For example:
    - Solution uuid = <b>_04ce2520-80ca-11eb-8dcd-c9615c9f23ba</b>
    - Screen uuid = <b>_04ce2520-80ca-11eb-8dcd-c9615c9f23ba</b>_0159a78t-80ca-11eb-8dcd-c9614ahr7hb5

- Type: It indicates if the service is a Solution a Screen or a Widget
- Info: Field containing an object with the service information

Storing this way the uuid's would allow us to query all the childs of a service only using the primary key (beeing faster than involving a column that not corresponds to the primary key)

### Authentication

For the authentication part I use Cognito, there is one endpoint to register a user to the cognito user pool (email verification is needed), one endpoint to login that returns the token (JWT) that we will need to add to the authorization headers of the services requests (add a service, get user services, ...) and one endpoint to logout the user.

## Deploy

To deploy the cloudformation just run `sls deploy` in the terminal, this will create the `Coognito user pool and application client`, the `lambda functions`, the `Dynamodb table` and the `api gateway`, also will tell the services endpoint to authenticate using cognito.

## TODO
There are some things that remain pending and could be improved. Some have consumed me a few hours and I have been able to solve them and others I cannot find a way to do it. For example, the environment variables of the Cognito UserPools, when I run the serverless offline, they take the value <em>undefined</em>.

For the authentication using cognito, it is necessary to put hardcoded the value of the Arn of UserPool because if not it does not get the value correctly and I cannot do the deploy. 

If I had had more time I would also have liked to do a responseController and an errorHandler to unify the responses of the api a little bit and make the code more readable. And something that I also would have liked is to have had time to document and do more tests.

Although there are surely many things that can be greatly improved, it has been a challenge to work with serverless technology, integrate all the features to be deployed with one step and not needing to use the AWS web interface, use AWS services and learn how Cognito and DynamoDb work.

Despite this and the fact of being stucked at some points for many hours, I have tried to put the maximum will and commitment in the test and I hope the interest is reflected in it since I really would like to work in your company.