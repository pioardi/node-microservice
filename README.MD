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
_id ( default mongo db id )
displayName ( type string , required)
parentIds ( type array of ObjectID , ref to Category , index true)

Rationale : 
<ul>
    <li>
        Avoid to use embedded document because we can have a lot of sub categories and templates associated to a category , to allow ACID I will use cross document transactions,even because I think that delete and move are not stressed as API , into a real life scenario I think that people will create/update/delete categories ,but the most frequent operation is to read/create a template.
    </li>
    <li>categoryId on Template is not mandatory because we can create a template without a category.
    </li>
    <li>
        ParentIds is an array that contains all super categories, I did some existency checks (Will try to improve during the next hours).
        It is indexed because I use it on delete and move operation for categories.
    </li>
</ul>

<h2>Rest API</h2>
In general I would like to provide a yaml file,swagger compliant that describe an API, but I will not have time to do that , so please look at api folder , and also integration tests are documentation. <br>


<h2>Test suite</h2>
The test numer 10 is not permitted by designed, so it is not implemented.<br>

<h2>CI</h2>
The badge that you will find on top of this README is a continous integration example, it will start when someone commits.

<h2>Validation & Error Handling</h2>
TODO

<h2>Optimization</h2>

<h2>Configuration</h2>
Some points of this POC are configurable, you can find all details into the config folder ( index.js file) , in particular you can choose your mongo db connection string ( db will be xara-test).

<h2>How to run</h2>
To start the application -> node app.js <br>
To run tests ( if you want use my docker compose file to get some mongodb instance, follow this https://gist.github.com/harveyconnor/518e088bad23a273cae6ba7fc4643549 ) :
<ul>
    <li>export DATA_SOURCE_CONNECTION_STRING=YOUR_MONGO_DB</li>
    <li>
        npm run test
    </li>
</ul>

