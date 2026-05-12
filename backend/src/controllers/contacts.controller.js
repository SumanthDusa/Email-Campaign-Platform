const prisma = require("../lib/prisma");

const csv = require("csv-parser");

const stream = require("stream");

async function createContact(
  req,
  res
) {
  try {
    const {
      email,
      firstName,
      lastName,
    } = req.body;

    console.log(req.body);

    console.log(req.user);

    if (!email) {
      return res.status(400).json({
        message:
          "Email required",
      });
    }

    const existing =
      await prisma.contact.findFirst({
        where: {
          email,
          userId:
            req.user.id,
        },
      });

    if (existing) {
      return res.status(400).json({
        message:
          "Contact already exists",
      });
    }

    const contact =
      await prisma.contact.create({
        data: {
          email,

          firstName:
            firstName || "",

          lastName:
            lastName || "",

          userId:
            req.user.id,
        },
      });

    return res.json(contact);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to create contact",
    });
  }
}

async function getContacts(
  req,
  res
) {
  try {
    const contacts =
      await prisma.contact.findMany({
        where: {
          userId: req.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json(contacts);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to fetch contacts",
    });
  }
}



async function importContactsFromCsv(
  req,
  res
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message:
          "CSV file required",
      });
    }

    const results = [];

    const bufferStream =
      new stream.PassThrough();

    bufferStream.end(
      req.file.buffer
    );

    bufferStream
      .pipe(
        csv()
      )
      .on(
        "data",
        (data) => {
          results.push(data);
        }
      )
      .on(
        "end",
        async () => {
          try {
            for (const row of results) {
              await prisma.contact.create(
                {
                  data: {
                    email:
                      row.email,

                    firstName:
                      row.firstName ||
                      "",

                    lastName:
                      row.lastName ||
                      "",

                    userId:
                      req.user.id,
                  },
                }
              );
            }

            return res.json({
              message:
                "Contacts imported",
            });
          } catch (error) {
            console.log(error);

            return res.status(500).json({
              message:
                "Import failed",
            });
          }
        }
      );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "CSV import failed",
    });
  }
}

async function getContactsByList(
  req,
  res
) {
  try {
    const contacts =
      await prisma.contact.findMany({
        where: {
          userId: req.user.id,
        },
      });

    return res.json(contacts);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to fetch contacts",
    });
  }
}

async function deleteContact(
  req,
  res
) {
  try {
    await prisma.contact.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.json({
      message:
        "Contact deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to delete contact",
    });
  }
}

module.exports = {
  createContact,
  getContacts,
  importContactsFromCsv,
  getContactsByList,
  deleteContact,
};