# Proof of concept documentation

[![Actions Status](https://github.com/xara-server-test/xara-test-alessandro/workflows/Node%20CI/badge.svg)](https://github.com/xara-server-test/xara-test-alessandro/actions)


<h1>General discussion</h1>
I am writing this doc to explain some decisions and to document the proof of concept as better as possible. <br>

<h2>Data Model</h2>
<strong>Template</strong><br>
_id ( default mongo db id)<br>
displayName ( type string , mandatory)<br>
categoryId ( type objectID , ref to category collection)<br>

<strong>Category</strong><br>
_id ( default mongo db id )<br>
displayName ( type string , required)<br>
anchestorIds ( type array of ObjectID , ref to Category , index true)<br>

Rationale : 
<ul>
    <li>
        Avoided to use embedded document because we can have a lot of sub categories and templates associated to a category, moreover a template should exists without a category , to allow ACID I will use cross document transactions,even because I think that delete and move are not stressed as API , into a real life scenario I think that people will create/update/delete categories with low frequency ,but the most frequent operation is to read/create a template.
    </li>
    <li>categoryId on Template is not mandatory because we can create a template without a category.
    </li>
    <li>
        anchestorIds is an array that contains all anchestors ( parent included), I did some existency checks (Will try to improve during the next hours).
        It is indexed because I use it on delete and move operation for categories.
    </li>
    <li>Display name on template/category is not indexed , to do that we should understand the UI to serve, based on that we can decide for different types of indexes ( text indexes for example ) , into my API I always retrieve documents by id.</li>
</ul>

<h2>Rest API</h2>
In general I would like to provide a yaml file,swagger compliant that describe an API, but I will not have time to do that , so please look at api folder , and also integration tests are documentation. <br>


<h2>Test suite</h2>
The test numer 10 is not permitted by designed, so it is not implemented.<br>
I added two more cases to the test suite for some validations , other scenarios/api/validation are not tested into a script , but I tested them with a Rest client.

<h2>CI</h2>
The badge that you will find on top of this README is a continous integration example, it will start when someone commits.

<h2>Validation & Error Handling</h2>
Express already has a default error handler for sync operations, since that I am using await I am doing try/catch to return custom messages when input is not valid or a runtime exception occurs.<br>
You will find validation for refId existence to other documents and mandatory fields (this is implemented ).<br>
If we want that a category must have one parent category only ( no checks implemented ) , we have two options (I prefer the second one) :<br>
<ul>
    <li>Validate parentIds in input and check that are related between them</li>
    <li>Take in input a parent id( not all the anchestors ) only from the Rest Api , read that parent id ,get the anchestors, put the anchestors and the parent into the new category. This should also improve API experience</li>
</ul>

<h2>Optimization</h2>
I have some TODO comments on optimization , in particular we could use Promise.all to improve performance of moveCategory and deleteCategory , both of them use transactions and do more than one write operation. We could do that if target NFR is not meet with sequential implementation.
I used Promise.all during anchestorIds validations , validating in parallel all ids present into the request body, also used a Promise.all into the test suite.

<h2>Configuration</h2>
Some points of this POC are configurable, you can find all details into the config folder ( index.js file) , in particular you can choose your mongo db connection string ( db will be xara-test).

<h2>How to run</h2>
To start the application -> node app.js <br>
To run tests ( if you want use my docker compose file to get some mongodb instance, follow this https://gist.github.com/harveyconnor/518e088bad23a273cae6ba7fc4643549 ) :
<ul>
    <li>export DATA_SOURCE_CONNECTION_STRING=YOUR_MONGO_DB ( the default is a mongo deployed to db atlas , but I suggest you to use another instance )</li>
    <li>
        npm run test
    </li>
</ul>

<h2>Thanks</h2>
Thanks to Xara and to Roberto/Jimmy for this test,I had no doubt that it would be interesting and challenging.
