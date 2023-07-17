const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.token, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1rt7dk9.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const driver = client.db('xox').collection('driver-users');
const rider = client.db('xox').collection('rider-users');
const ambassador = client.db('xox').collection('ambassador-users');

// const sellPostCollection = client.db('superWheels').collection('sellpost');


async function  run(){
    try{





        // const verifyAdmin = async (req, res, next) =>{
        //     const decodedEmail = req.decoded.email;
        //     const query = { email: decodedEmail };
        //     const user = await usersCollection.findOne(query);
    
        //     if (user?.role !== 'admin') {
        //         return res.status(403).send({ message: 'forbidden access' })
        //     }
        //     next();
        // }
        // const verifySeller = async (req, res, next) =>{
        //     const decodedEmail = req.decoded.email;
        //     const query = { email: decodedEmail };
        //     const user = await usersCollection.findOne(query);
    
        //     if (user?.role !== 'seller') {
        //         return res.status(403).send({ message: 'forbidden access' })
        //     }
        //     next();
        // }

        app.post('/driver-signup', async (req, res) => {
            const signup = req.body;
            console.log(signup);
            const query = {
                name: signup.name,
                mobile: signup.mobile,
                email: signup.email,
                password: signup.password,
            }

            const alreadysignup = await driver.find(query).toArray();

            if (alreadysignup.length) {
                const message = `You already have a signup ${signup.email}`
                return res.send({ acknowledged: false, message })
            }

            const result = await driver.insertOne(signup);
            res.send(result)
        })
        app.post('/rider-signup', async (req, res) => {
            const signup = req.body;
            console.log(signup);
            const query = {
                name: signup.name,
                mobile: signup.mobile,
                email: signup.email,
                password: signup.password,
            }

            const alreadysignup = await rider.find(query).toArray();

            if (alreadysignup.length) {
                const message = `You already have a signup ${signup.email}`
                return res.send({ acknowledged: false, message })
            }

            const result = await rider.insertOne(signup);
            res.send(result)
        })
        app.post('/ambassador-signup', async (req, res) => {
            const signup = req.body;
            console.log(signup);
            const query = {
                name: signup.name,
                mobile: signup.mobile,
                email: signup.email,
                password: signup.password,
            }

            const alreadysignup = await ambassador.find(query).toArray();

            if (alreadysignup.length) {
                const message = `You already have a signup ${signup.email}`
                return res.send({ acknowledged: false, message })
            }

            const result = await ambassador.insertOne(signup);
            res.send(result)
        })





        // ...existing code...

        app.post('/driver-signin', async (req, res) => {
            const { email, password } = req.body;
            const query = { email, password };

            const driverUser = await driver.findOne(query);

            if (!driverUser) {
                return res.status(404).send({ message: 'User not found' });
            }

            const token = jwt.sign({ email: driverUser.email }, process.env.token);
            res.send({ token });
        });

        app.post('/rider-signin', async (req, res) => {
            const { email, password } = req.body;
            const query = { email, password };

            const riderUser = await rider.findOne(query);

            if (!riderUser) {
                return res.status(404).send({ message: 'User not found' });
            }

            const token = jwt.sign({ email: riderUser.email }, process.env.token);
            res.send({ token });
        });

        app.post('/ambassador-signin', async (req, res) => {
            const { email, password } = req.body;
            const query = { email, password };

            const ambassadorUser = await ambassador.findOne(query);

            if (!ambassadorUser) {
                return res.status(404).send({ message: 'User not found' });
            }

            const token = jwt.sign({ email: ambassadorUser.email }, process.env.token);
            res.send({ token });
        });

// ...remaining code...


        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await driver.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.token, { expiresIn: '24h' })
                return res.send({ token: token });
            }
            res.status(403).send({ token: '' })
        });

















        // app.post('/signin', async (req, res) => {
        //     try {
        //         const { email, password } = req.body;

        //         // Check if the user exists in the driver collection
        //         const driverUser = await driver.findOne({ email, password });
        //         if (driverUser) {
        //             // Generate a JWT token for the driver user
        //             const token = generateToken(driverUser._id);
        //             return res.status(200).json({ token });
        //         }

                

        //         // If the user is not found in any of the collections, return an error
        //         return res.status(400).json({ message: 'Invalid email or password' });
        //     } catch (error) {
        //         console.log(error);
        //         res.status(500).json({ message: 'Internal server error' });
        //     }
        // });

        // // Check if the user exists in the rider collection
        // const riderUser = await rider.findOne({ email, password });
        // if (riderUser) {
        //     // Generate a JWT token for the rider user
        //     const token = generateToken(riderUser._id);
        //     return res.status(200).json({ token });
        // }

        // // Check if the user exists in the ambassador collection
        // const ambassadorUser = await ambassador.findOne({ email, password });
        // if (ambassadorUser) {
        //     // Generate a JWT token for the ambassador user
        //     const token = generateToken(ambassadorUser._id);
        //     return res.status(200).json({ token });
        // }
        


        // app.post('/signin', async (req, res) => {
        //     try {
        //         const { email, password } = req.body;
        //         const user = await User.findOne({ email });
        //         if (!user) {
        //             return res.status(400).json({ message: 'Invalid email or password' });
        //         }

        //         const isValidPassword = await user.comparePassword(password);
        //         if (!isValidPassword) {
        //             return res.status(400).json({ message: 'Invalid email or password' });
        //         }

        //         // Generate JWT token and send it in the response
        //         const token = generateToken(user._id);
        //         res.status(200).json({ token });
        //     } catch (error) {
        //         console.log(error);
        //         res.status(500).json({ message: 'Internal server error' });
        //     }
        // });
        


        app.get('/sellpost',async (req,res)=>{
            const query = {};
            const result = await sellPostCollection.find(query).toArray();
            res.send(result)
        })
        
        app.get('/sellpost/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const sellpost = await sellPostCollection.findOne(query);
            res.send(sellpost);
        })


        app.get('/sellposts',verifyJWT, async(req, res)=>{
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
    
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = {email: email};
            const posts = await sellPostCollection.find(query).toArray();
            res.send(posts)  
        })

        app.post('/sellpost', async(req, res)=>{
            const doctor = req.body;
            const result = await sellPostCollection.insertOne(doctor);
            res.send(result);
        })

        app.delete('/sellpost/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await sellPostCollection.deleteOne(filter);
            res.send(result);
        })

        


    
        
        
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })

        
        
       

        

        
    }
    finally{

    }
}
run().catch(console.log)




app.get('/', async(req,res)=>{
    res.send('Super Wheels server is running')
})
app.listen(port, ()=>console.log(`Super Wheels server running on ${port}`))



