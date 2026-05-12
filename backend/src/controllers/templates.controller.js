const prisma = require(
  "../lib/prisma"
);

async function createTemplate(
  req,
  res
) {
  try {
    const {
      name,
      subject,
      content,
    } = req.body;

    const template =
      await prisma.template.create(
        {
          data: {
            name,
            subject,
            content,
            userId:
              req.user.id,
          },
        }
      );

    return res.status(201).json(
      template
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Failed to create template",
    });
  }
}

async function getTemplates(
  req,
  res
) {
  try {
    const templates =
      await prisma.template.findMany(
        {
          where: {
            userId:
              req.user.id,
          },

          orderBy: {
            createdAt:
              "desc",
          },
        }
      );

    return res.json(
      templates
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Failed to fetch templates",
    });
  }
}

async function updateTemplate(
  req,
  res
) {
  try {
    const {
      name,
      subject,
      content,
    } = req.body;

    const template =
      await prisma.template.update(
        {
          where: {
            id: req.params.id,
          },

          data: {
            name,
            subject,
            content,
          },
        }
      );

    return res.json(
      template
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Failed to update template",
    });
  }
}

async function deleteTemplate(
  req,
  res
) {
  try {
    await prisma.template.delete(
      {
        where: {
          id: req.params.id,
        },
      }
    );

    return res.json({
      message:
        "Template deleted",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Failed to delete template",
    });
  }
}

module.exports = {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
};