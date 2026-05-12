const prisma = require("../lib/prisma");

function parsePagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}

async function getLists(req, res) {
  const userId = req.user.sub;
  const { page, limit, skip } = parsePagination(req.query);
  const search = (req.query.search || "").trim();

  try {
    const where = {
      userId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [lists, total] = await Promise.all([
      prisma.contactList.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactList.count({ where }),
    ]);

    return res.json({
      data: lists,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch lists", error: error.message });
  }
}

async function createList(req, res) {
  const userId =
    req.user.id ||
    req.user.sub;

  const {
    name,
    description,
    contactIds,
  } = req.body;

  if (
    !name ||
    typeof name !== "string"
  ) {
    return res.status(400).json({
      message:
        "List name is required",
    });
  }

  try {
    const list =
      await prisma.contactList.create(
        {
          data: {
            userId,

            name:
              name.trim(),

            description:
              description?.trim() ||
              null,
          },
        }
      );

    if (
      contactIds &&
      contactIds.length > 0
    ) {
      await prisma.contactListMember.createMany(
        {
          data:
            contactIds.map(
              (
                contactId
              ) => ({
                listId:
                  list.id,

                contactId,
              })
            ),
        }
      );
    }

    return res
      .status(201)
      .json(list);
  } catch (error) {
    if (
      error.code ===
      "P2002"
    ) {
      return res.status(409).json({
        message:
          "A list with this name already exists",
      });
    }

    return res.status(500).json({
      message:
        "Failed to create list",

      error:
        error.message,
    });
  }
}

async function deleteList(
  req,
  res
) {
  const userId =
    req.user.id ||
    req.user.sub;

  const { id } =
    req.params;

  try {
    const existing =
      await prisma.contactList.findFirst(
        {
          where: {
            id,
            userId,
          },
        }
      );

    if (!existing) {
      return res.status(404).json({
        message:
          "List not found",
      });
    }

    await prisma.emailEvent.deleteMany(
      {
        where: {
          campaign: {
            contactListId:
              id,
          },
        },
      }
    );

    await prisma.campaign.deleteMany(
      {
        where: {
          contactListId:
            id,
        },
      }
    );

    await prisma.contactListMember.deleteMany(
      {
        where: {
          listId: id,
        },
      }
    );

    await prisma.contactList.delete(
      {
        where: {
          id,
        },
      }
    );

    return res.json({
      message:
        "List deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Failed to delete list",

      error:
        error.message,
    });
  }
}


module.exports = {
  getLists,
  createList,
  deleteList,
};
