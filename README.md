# Cloud-Native-Application-Development--SQS
About the website : In this assignment, we have developed a pizza
ordering application in which customers can order items and their requests
will be first sent in SQS and then later will be inserted in DynamoDB
through Lambda function.

Flow of architecture :
1) Website has been developed using NodeJS, ExpressJS, HTML and
CSS. Its code is running inside an EC2 instance.
2) A customer’s request on order will be first sent in SQS (using
functions from AWS-SDK).
3) Then, Lambda function will be triggered (on clients’ requests’
insertion in SQS) and it will insert that request from SQS to
DynamoDB.

![image](https://github.com/bardock-2393/Cloud-Native-Application-Development---SQS/assets/160537536/6d824307-2c4e-45b1-8cdc-66bd4d7c3de2)


