const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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
const package = client.db('xox').collection('package');
const adminUser = client.db('xox').collection('adminUser');

// const sellPostCollection = client.db('superWheels').collection('sellpost');








async function run() {
    try {



        // Configure Nodemailer with your email provider's settings
        
        app.post('/rider-email', async (req, res) => {
            // Process the payment and generate a unique code
            const email = req.body.email; // Assuming the email is provided in the request body
            function generateUniqueCode(length = 6) {
                const digits = '0123456789';
                let code = '';

                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * digits.length);
                    code += digits.charAt(randomIndex);
                }

                return code;
            }
            const uniqueCode = generateUniqueCode(); // Replace with your logic to generate a unique code

            try {
                const transporter = nodemailer.createTransport({
                    // Configure the email service or provider details here
                    // Example configuration for Gmail:
                    service: 'gmail',
                    auth: {
                        user: 'xox34260@gmail.com',
                        pass: 'xvbxnlorfxuffxmp'
                    }
                });

                const mailOptions = {
                    from: 'xox34260@gmail.com',
                    to: email,
                    subject: 'Payment Confirmation',
                    text: `Thank you for your payment. Your unique code is:${uniqueCode} `
                };

                await transporter.sendMail(mailOptions);
                console.log('Confirmation email sent!');
            } catch (error) {
                console.error('Error sending confirmation email:', error);
            }

            // Send the response back to the client
            res.send(uniqueCode);
            // Send the confirmation email

        });
        app.post('/ambassador-email', async (req, res) => {
            // Process the payment and generate a unique code
            const email = req.body.email; // Assuming the email is provided in the request body
            function generateUniqueCode(length = 6) {
                const digits = '0123456789';
                let code = '';

                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * digits.length);
                    code += digits.charAt(randomIndex);
                }

                return code;
            }
            const uniqueCode = generateUniqueCode(); // Replace with your logic to generate a unique code

            try {
                const transporter = nodemailer.createTransport({
                    // Configure the email service or provider details here
                    // Example configuration for Gmail:
                    service: 'gmail',
                    auth: {
                        user: 'xox34260@gmail.com',
                        pass: 'xvbxnlorfxuffxmp'
                    }
                });

                const mailOptions = {
                    from: 'xox34260@gmail.com',
                    to: email,
                    subject: 'Payment Confirmation',
                    text: `Thank you for your payment. Your unique code is:${uniqueCode} `
                };

                await transporter.sendMail(mailOptions);
                console.log('Confirmation email sent!');
            } catch (error) {
                console.error('Error sending confirmation email:', error);
            }

            // Send the response back to the client
            res.send(uniqueCode);
            // Send the confirmation email

        });


        app.post('/driver-email', async (req, res) => {
            // Process the payment and generate a unique code
            const email = req.body.email; // Assuming the email is provided in the request body
            // function generateUniqueCode(length = 6) {
            //     const digits = '0123456789';
            //     let code = '';

            //     for (let i = 0; i < length; i++) {
            //         const randomIndex = Math.floor(Math.random() * digits.length);
            //         code += digits.charAt(randomIndex);
            //     }

            //     return code;
            // }
            // const uniqueCode = generateUniqueCode(); // Replace with your logic to generate a unique code

            try {
                const transporter = nodemailer.createTransport({
                    // Configure the email service or provider details here
                    // Example configuration for Gmail:
                    service: 'gmail',
                    auth: {
                        user: 'xox34260@gmail.com',
                        pass: 'xvbxnlorfxuffxmp'
                    }
                });

                const mailOptions = {
                    from: 'xox34260@gmail.com',
                    to: email,
                    subject: 'Payment Confirmation',
                    text: `Thank you for your payment.`
                };

                await transporter.sendMail(mailOptions);
                console.log('Confirmation email sent!');
            } catch (error) {
                console.error('Error sending confirmation email:', error);
            }

            // Send the response back to the client
            res.send();
            // Send the confirmation email

        });








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


        // app.post('/driver-signup', async (req, res) => {
        //     const signup = req.body;
        //     console.log(signup);
        //     const query = {
        //         name: signup.name,
        //         mobile: signup.mobile,
        //         email: signup.email,
        //         invite_code: signup.invite_code,
        //         password: signup.password,
        //     }

        //     const alreadysignup = await driver.find(query).toArray();

        //     if (alreadysignup.length) {
        //         const message = `You already have a signup ${signup.email}`
        //         return res.send({ acknowledged: false, message })
        //     }

        //     const result = await rider.insertOne(signup);
        //     res.send(result);
        // })

        app.post('/rider-signup', async (req, res) => {
            const signup = req.body;
            console.log(signup);
            const query = {
                name: signup.name,
                mobile: signup.mobile,
                email: signup.email,
                invite_code: signup.invite_code,
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
            };
          
            const alreadysignup = await ambassador.find(query).toArray();
          
            if (alreadysignup.length) {
              const message = `You already have a signup ${signup.email}`;
              return res.send({ acknowledged: false, message });
            }
          
            const result = await ambassador.insertOne(signup);
          
            // Sending email notification
            try {
              const email = signup.email; // Assuming the email is provided in the request body
          
              function generateUniqueCode(length = 6) {
                const digits = '0123456789';
                let code = '';
          
                for (let i = 0; i < length; i++) {
                  const randomIndex = Math.floor(Math.random() * digits.length);
                  code += digits.charAt(randomIndex);
                }
          
                return code;
              }
          
              const uniqueCode = generateUniqueCode(); // Replace with your logic to generate a unique code
          
              const transporter = nodemailer.createTransport({
                // Configure the email service or provider details here
                // Example configuration for Gmail:
                service: 'gmail',
                auth: {
                  user: 'xox34260@gmail.com',
                  pass: 'xvbxnlorfxuffxmp',
                },
              });
          
              const mailOptions = {
                from: 'xox34260@gmail.com',
                to: email,
                subject: 'Payment Confirmation',
                text: `Thank you for your payment. Your unique code is: ${uniqueCode}`,
              };
          
              await transporter.sendMail(mailOptions);
              console.log('Confirmation email sent!');
              
              // Send the response back to the client
              res.send({ acknowledged: true, message: 'Confirmation email sent', code: uniqueCode });
            } catch (error) {
              console.error('Error sending confirmation email:', error);
              res.send({ acknowledged: false, message: 'Failed to send confirmation email' });
            }
          
            res.send(result);
          });
          









        // Admin Login APi


        app.post('/admin-signin', async (req, res) => {
            const { email, password } = req.body;
            const query = { email, password };

            const admin = await adminUser.findOne(query);

            if (!admin) {
                return res.status(404).send({ message: 'User not found' });
            }

            const token = jwt.sign({ email: admin.email }, process.env.token);
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

        app.post('/add-package', async (req, res) => {
            const addpackage = req.body;
            console.log(addpackage);
            const query = {
                title: addpackage.title,
                price: addpackage.price,
                subtitle: addpackage.subtitle,
                detailsField1: addpackage.detailsField1,
                detailsField2: addpackage.detailsField2,
                detailsField3: addpackage.detailsField3,
                detailsField4: addpackage.detailsField4
            }

            const result = await package.insertOne(addpackage);
            res.send(result)
        })



















        app.get('/driver', async (req, res) => {
            const query = {};
            const result = await driver.find(query).toArray();
            res.send(result)
        })
        app.get('/rider', async (req, res) => {
            const query = {};
            const result = await rider.find(query).toArray();
            res.send(result)
        })
        app.get('/ambassador', async (req, res) => {
            const query = {};
            const result = await ambassador.find(query).toArray();
            res.send(result)
        })
        app.get('/package', async (req, res) => {
            const query = {};
            const result = await package.find(query).toArray();
            res.send(result)
        })

        app.delete('/driver/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await driver.deleteOne(filter);
            res.send(result);
            console.log(result);
        })
        app.delete('/rider/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await rider.deleteOne(filter);
            res.send(result);
        })
        app.delete('/ambassador/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await ambassador.deleteOne(filter);
            res.send(result);
        })
        app.delete('/package/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await package.deleteOne(filter);
            res.send(result);
            console.log(result);
        })

    }
    finally {

    }
}
run().catch(console.log)




app.get('/', async (req, res) => {
    res.send('Xox Ride server is running')
})
app.listen(port, () => console.log(`Xox Ride server running on ${port}`))



