import express from "express"
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890', 20)

const app = express();
const port = 5001;

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Server is Started")
})

let product = [{
    id: nanoid(), // always a number
    name: "macebook",
    price: "$1300",
    desc: "macebook description"
}]

app.get("/product", (req, res) => {
    res.send({
        message: "all product",
        data: product
    })
})

app.get("/product/:id", (req, res) => {

    // if (isNaN(req.param.id)) {
    //     res.status(400).send("Invalid product id")
    // }

    let isFound = false;

    for (let i = 0; i < product.length; i++) {
        if (product[i].id === +req.params.id) {
            isFound = i;
            break;
        }
    }

    if (isFound === false) {
        res.status(404).send({
            message: "Product not found",
        })
    } else {
        res.status(200).send({
            message: "product found with id",
            data: product[isFound]
        })
    }
})

app.post("/product", (req, res) => {

    if (
        req.body.name
        || req.body.price
        || req.body.desc
    ) {
        res.status(403).send({
            message: `
            required parameter is missing! example JSON request body: 
            {
                name: "macebook",
                price: "$1300",
                desc: "macebook description"
            }   `,
        })
    }

    product.push({
        id: nanoid(), // generate id
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc,
    })

    res.status(201).send({
        message: "created product",
    })
})

app.put("/product/:id", (req, res) => {
    if (
        req.body.name
        || req.body.price
        || req.body.desc
    ) {
        res.status(403).send({
            message: `
            required parameter is missing!
            atleast one parameter is required: 
            example JSON request body: 
            {
                name: "macebook",
                price: "$1300",
                desc: "macebook description"
            }   `,
        })
    }

    let isFound = false;

    for (let i = 0; i < product.length; i++) {
        if (product[i].id === req.params.id) {
            isFound = i;
            break;
        }
    }

    if (isFound === false) {
        res.status(404).send({
            message: "Product not found",
        })
    } else {

        if (req.body.name) product[isFound].name = req.body.name;
        if (req.body.price) product[isFound].price = req.body.price;
        if (req.body.desc) product[isFound].desc = req.body.desc;

        res.status(200).send({
            message: "product is updated with id:" + product[isFound].id,
            data: product[isFound]
        })
    }

})

app.delete("/product/:id", (req, res) => {

    let isFound = false;
    let deletedProduct = [];

    for (let i = 0; i < product.length; i++) {
        if (product[i].id === +req.params.id) {
            isFound = i;
            break;
        }
    }

    if (isFound === false) {
        res.status(404).send({
            message: "Product not found",
        })
    } else {
        deletedProduct.push({ delete_product: product[isFound] })
        product.splice(isFound, 1);
        res.status().send({
            message: "product deleted",
            product: deletedProduct,
        })
    }
})

app.listen(port, () => {
    console.log("server is started on port: " + port);
})