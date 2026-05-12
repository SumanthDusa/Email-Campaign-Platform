const express = require("express");

const prisma = require("../lib/prisma");

const router = express.Router();

router.get(
  "/:contactId",
  async (req, res) => {
    try {
      const { contactId } =
        req.params;

      await prisma.contact.update(
        {
          where: {
            id: contactId,
          },

          data: {
            unsubscribed: true,
          },
        }
      );

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribed</title>

          <style>
            body{
              margin:0;
              padding:0;
              background:#f8fafc;
              font-family:Arial,sans-serif;
              display:flex;
              justify-content:center;
              align-items:center;
              height:100vh;
            }

            .card{
              background:white;
              padding:40px;
              border-radius:20px;
              box-shadow:0 10px 30px rgba(0,0,0,0.1);
              text-align:center;
              max-width:420px;
            }

            h1{
              color:#16a34a;
              margin-bottom:12px;
            }

            p{
              color:#475569;
              line-height:1.6;
            }
          </style>
        </head>

        <body>
          <div class="card">
            <h1>
              Unsubscribed Successfully
            </h1>

            <p>
              You will no longer receive campaign emails from us.
            </p>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      console.log(error);

      return res.status(500).send(`
        <h1>
          Failed to unsubscribe
        </h1>
      `);
    }
  }
);

module.exports = router;