const express = require('express');
const bodyParser = require('body-parser');

const port = process.argv.slice(2)[0];

const app = express();
var sqlite3 = require('sqlite3').verbose();

var http = require('http');
var path = require("path");
var helmet = require('helmet');



var server = http.createServer(app);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./Public')));
app.use(helmet());

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'./Public/index.html'));
  });

console.log(`Orders service listening on port ${port}`);
app.listen(port);
const AWS = require('aws-sdk');

// Configure the region
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = "https://sqs.us-east-1.amazonaws.com/215442110932/nodeshop.fifo";

// the new endpoint
app.post('/order', (req, res) => {

    let orderData = {
        'userEmail': req.body['userEmail'],
        'itemName': req.body['itemName'],
        'itemPrice': req.body['itemPrice'],
        'itemsQuantity': req.body['itemsQuantity']
    }

    let sqsOrderData = {
        MessageAttributes: {
          "userEmail": {
            DataType: "String",
            StringValue: orderData.userEmail
          },
          "itemName": {
            DataType: "String",
            StringValue: orderData.itemName
          },
          "itemPrice": {
            DataType: "Number",
            StringValue: orderData.itemPrice
          },
          "itemsQuantity": {
            DataType: "Number",
            StringValue: orderData.itemsQuantity
          }
        },
        MessageBody: JSON.stringify(orderData),
        MessageDeduplicationId: req.body['userEmail'],
        MessageGroupId: "UserOrders",
        QueueUrl: queueUrl
    };

    // Send the order data to the SQS queue
    let sendSqsMessage = sqs.sendMessage(sqsOrderData).promise();

    sendSqsMessage.then((data) => {
        console.log(`OrdersSvc | SUCCESS: ${data.MessageId}`);
        res.send("Thank you for your order.");
    }).catch((err) => {
        console.log(`OrdersSvc | ERROR: ${err}`);

        // Send email to emails API
        res.send("We ran into an error. Please try again.");
    });
});