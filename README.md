# Image Repo App

1. [ Introduction ](#intro)
2. [ Tech ](#tech)
3. [ Usage ](#usage)
4. [ Tests ](#tests)
5. [ Future Improvements ](#improvements)

<a name="intro"></a>
## 1. Description

I created a social media-like application where users can post images and other users can buy it with credits. <br> <br>
Users earn credits through a lottery system by participating in the application (posting pictures).
As soon as a buyer purchases the seller's post, the buyer will have their total credits transferred to the seller. <br>

<a name="tech"></a>
## 2. Technologies Used

I used a Node.js/Express.js/Mongo.DB stack along with rendering with EJS. I styled the site mostly with UIKit (CSS). 

<a name="usage"></a>
## 3. Usage

```bash
git clone https://github.com/victoranyun/Shopify-Backend-Dev-Challenge
cd Shopify-Backend-Dev-Challenge
npm install
npm start
```

Navigate to http://localhost:3001 using your favorite browser!

<a name="tests"></a>
## 4. Tests
To run all the tests (under /test/)
```bash
npm test
```

<a name="improvements"></a>
## 5. Future improvements
1. Improve the storage of images. Currently I am storing the image's binary data into MongoDB directly, which isn't considered good practice for scalability. A better alternative would be to use AWS S3 to store the images when the user uploads them and store the location of that S3 file in MongoDB.
This helps with the horizontal scalability of the application as well as the storage efficiency for MongoDB.

2. Store user sessions in a Redis cluster to reduce overhead on querying the database for session IDs. At the moment, the implementation stores the session data in MongoDB.

3. Improve the modularity of functions from the routes itself to controllers. This also makes it easier to unit test functions.

4. Add the feature to update posts. This endpoint already exists but given the time constraints, I only implemented the API to update the MongoDB record.





