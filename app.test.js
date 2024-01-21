process.env.NODE_ENV === "test";

const request = require("supertest");
const app = require("./app");
const db = require("./db");
const Book = require("./models/book");


const data = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
}

const data2 = {
    "isbn": "0691161516",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
}

describe("Books Routes Test", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM books");
        let book1 = await Book.create(data);
    });

    describe("GET /books/", function () {
        test("can see all books", async function () {
            let response = await request(app).get('/books/');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ "books": [data] })
        });
    });
    describe("GET /books/:id", function () {
        test("Get a book by id", async function () {
            let response = await request(app).get(`/books/${data.isbn}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ "book": data })
        });
    });
    describe("POST /books/", function () {
        test("Post a new book", async function () {
            let response = await request(app).post(`/books/`).send(data2);
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({ "book": data2 })
        });
    });
    describe("POST /books/", function () {
        test("Post a new book with missing info", async function () {
            let response = await request(app).post(`/books/`).send({
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            });
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ "error": { "message": ["instance requires property \"isbn\""], "status": 400 }, "message": ["instance requires property \"isbn\""] }
            )
        });
    });
    describe("PUT /books/:isbn", function () {
        test("Updates a book, responds with the updated book", async function () {
            //update the title of the book insert Microbiology word
            let response = await request(app).put(`/books/${data.isbn}`).send({
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Microbiology",
                "year": 2017
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                "book":
                {
                    "isbn": "0691161518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lane",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Microbiology",
                    "year": 2017
                }
            })
        });
    });
    describe("PUT /books/:isbn", function () {
        test("Updates a book with wrong language (a number instead of a string), responds with the updated book", async function () {
            //update the title of the book insert Microbiology word
            let response = await request(app).put(`/books/${data.isbn}`).send({
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": 805,
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Microbiology",
                "year": 2017
            });
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({
                "error":
                {
                    "message": ["instance.language is not of a type(s) string",],
                    "status": 400,
                },
                "message": [
                    "instance.language is not of a type(s) string",
                ]
            });
        });
    });
    describe("DELETE /books/:id", function () {
        test("Get a book by id", async function () {
            let response = await request(app).delete(`/books/${data.isbn}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ "message": "Book deleted" })
        });
    });
});



afterAll(async function () {
    await db.end();
});

